import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindRequestDto } from '../../shared/dto/find-request.dto';
import { CoreService } from '../../shared/modules/routes/core.service';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { CreateScreenshotDto } from './dto/create-screenshot.dto';
import { UpdateScreenshotDto } from './dto/update-screenshot.dto';
import { Screenshot } from './entities/screenshot.entity';
import puppeteer from 'puppeteer';
import { ConvexService } from '../third-party/convex/convex.service';

@Injectable()
// @UseGuards(AdminAuthGuard)
export class ScreenshotService extends CoreService<Screenshot> {
  constructor(
    @InjectRepository(Screenshot)
    private readonly screenshotRepository: Repository<Screenshot>,
    private readonly convexService: ConvexService,
  ) {
    super(screenshotRepository);
  }

  async create(createScreenshotDto: CreateScreenshotDto, req: AuthRequest) {
    try {
      if (!createScreenshotDto.url)
        throw new HttpException('Missing url query', HttpStatus.BAD_REQUEST);
      const img = await this.captureElement(
        createScreenshotDto.url,
        createScreenshotDto.selector,
      );

      const convexFile = await this.convexService.handleUploadFile(img);

      await this.createCoreService([createScreenshotDto], req.user.userId);

      return convexFile;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async captureElement(url: string, selector: string): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const el = await page.waitForSelector(selector, { timeout: 10000 });
    const uint8 = await el.screenshot({ type: 'png' }); // => Uint8Array
    const buffer = Buffer.from(uint8); // -> Buffer
    return buffer;
  }

  async findAll(req: AuthRequest) {
    const findRequestDto = new FindRequestDto(req);

    const data = await this.findAllCoreServiceByFindRequestDto(findRequestDto);

    return data;
  }

  async findOne(id: number) {
    return await this.screenshotRepository.findOneBy({ id });
  }

  async findOneByName(name: string) {
    return await this.screenshotRepository.findOneBy({ name });
  }

  async update(
    id: number,
    updateScreenshotDto: UpdateScreenshotDto,
    req: AuthRequest,
  ) {
    const existed = await this.findOne(id);

    if (existed) {
      return await this.updateCoreService(
        { id },
        updateScreenshotDto,
        req.user.userId,
      );
    } else {
      throw new BadRequestException('App config not existed');
    }
  }

  async remove(id: number) {
    const removeEntity = await this.screenshotRepository.findOneBy({ id });

    if (removeEntity) {
      return await this.screenshotRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('Screenshot not existed');
    }
  }
}
