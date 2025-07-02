export enum DateType {
  lunarNewYear = 'lunarNewYear',
  holiday = 'holiday',
  weekday = 'weekday',
  weekend = 'weekend',
  surcharge = 'surcharge',
  unknown = 'unknown',
}

export function getFormatDate(format: string, date?: Date): string {
  if (!date) {
    date = new Date();
  }

  const result = format
    .replaceAll('yyyy', date.getFullYear().toString())
    .replaceAll(
      'MM',
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : (date.getMonth() + 1).toString(),
    )
    .replaceAll(
      'dd',
      date.getDate() + 1 < 10
        ? `0${date.getDate() + 1}`
        : (date.getDate() + 1).toString(),
    );

  return result;
}

export function formatDateToYYYYMMDD(date, separator = '/') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${day}`;
}

export function formatDateToYYYYMMDDHHMM(date, keepEmptyTime: boolean = true) {
  const ymd = formatDateToYYYYMMDD(date);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (hours === '00' && minutes === '00' && !keepEmptyTime) {
    return `${ymd}`;
  }

  return `${ymd} ${hours}:${minutes}`;
}

export function formatDateToDDMMYYYY(date, separator = '/') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}${separator}${month}${separator}${year}`;
}

export function formatDateToDDMMYYYYHHMM(date, keepEmptyTime: boolean = true) {
  const dmy = formatDateToDDMMYYYY(date);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (hours === '00' && minutes === '00' && !keepEmptyTime) {
    return `${dmy}`;
  }

  return `${dmy} ${hours}:${minutes}`;
}

export function formatDateToMMDDYYYY(date) {
  return (
    (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
    '/' +
    (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
    '/' +
    date.getFullYear()
  );
}

export function isDateValid(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function convertDateStringToDate(
  inputDateString: string,
  inputFormat: string,
) {
  const dateParts = inputDateString.split(/[^0-9]/);
  const formatParts = inputFormat.split(/[^YMDHhms]/i);

  const dateObj: any = {};
  formatParts.forEach((part, index) => {
    const value = parseInt(dateParts[index], 10);
    switch (part.toLowerCase()) {
      case 'y':
        dateObj.year = value;
        break;
      case 'm':
        dateObj.month = value - 1; // Month is zero-based in JavaScript Date
        break;
      case 'd':
        dateObj.day = value;
        break;
      case 'h':
        dateObj.hours = value;
        break;
      case 'i':
        dateObj.minutes = value;
        break;
      case 's':
        dateObj.seconds = value;
        break;
      default:
      // Ignore unsupported format parts
    }
  });

  const {
    year,
    month = 0,
    day = 1,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = dateObj;

  return new Date(year, month, day, hours, minutes, seconds);

  /*

// Example usage:
const dateString = '2023-09-22 12:34:56'; // The input date string
const inputFormat = 'Y-M-D H:i:s'; // The format of the input date string

const dateObject = convertDateStringToDate(dateString, inputFormat);
console.log(dateObject); // Outputs: "2023-09-22T12:34:56.000Z" (a valid Date object)
  */
}

export function getStartAndEndTimeInDate(date: Date) {
  const start = new Date(date);
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);

  const end = new Date(date);
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);

  return { start, end };
}

// export function getFutureDate(inputDate: DateArray) {}

export function excelDateToJSDate(inputDateString) {
  return new Date(Math.round((inputDateString - 25569) * 86400 * 1000));
}

export function checkValidDate(inputDateString) {
  const date = new Date(inputDateString);
  return !isNaN(date.getTime());
}

export function getDateDiff(
  from: Date,
  to: Date,
  returnDays: boolean = true,
): number {
  const diffTime = Math.abs(from.getTime() - to.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return returnDays ? diffDays : diffTime;
}

export function getDatesBetween(startDate: Date, endDate: Date) {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
