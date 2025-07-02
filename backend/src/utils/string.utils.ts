import { MetaType } from '../shared/interfaces/objectMeta.interface';
import { formatDateToDDMMYYYY, formatDateToDDMMYYYYHHMM } from './date.util';
import { numberWithCommas } from './number.utils';
import * as path from 'path';
import * as fs from 'fs';

export type BundleString = {
  [key: string]: string;
};

export function removeUnicodeCharacters(inputString) {
  // Use a regular expression to match all Unicode characters
  const regex = /[^\x00-\x7F]+/g;

  // Use the replace method to remove all occurrences of Unicode characters
  const result = inputString.replace(regex, '');

  return result;
}

export function createSlug(inputString) {
  inputString = removeDiacritics(inputString);

  return inputString
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, '') // Remove non-word characters except spaces and hyphens
    .replace(/[\s]+/g, '-') // Replace spaces with hyphens
    .replace(/^-+/g, '') // Remove leading hyphens
    .replace(/-+$/g, ''); // Remove trailing hyphens
}

export function customCreateFileName(inputString) {
  return `${createSlug(
    removeUnicodeCharacters(inputString.split('.').slice(0, -1).join(' ')),
  )}.${inputString.split('.').pop()}`;
}

export function isNumeric(str: string) {
  if (typeof str != 'string') return false; // we only process strings!
  return !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

export function arr_diff(item1: any, item2: any) {
  const tmp = [];
  const diff = [];

  for (let i = 0; i < item1.length; i++) {
    tmp[item1[i]] = true;
  }

  for (let i = 0; i < item2.length; i++) {
    if (tmp[item2[i]]) {
      delete tmp[item2[i]];
    } else {
      tmp[item2[i]] = true;
    }
  }

  for (const k in tmp) {
    diff.push(k);
  }

  return diff;
}

export function removeDiacritics(text: string) {
  // Use the `normalize` function to convert text to its base form (NFD)
  const normalizedText = text
    .replaceAll('đ', 'd')
    .replaceAll('Đ', 'd')
    .normalize('NFD');

  // Use a regular expression to match diacritics and replace them with an empty string
  return normalizedText
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x00-\x7F]+/g, '-');
}

export function validateEmail(email: string) {
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return String(email).trim().toLowerCase().match(regexEmail);
}

export function getMappingDoubleBracerList(template: string) {
  // const regex = /.*?({{.*?}})/g;
  const regex = /{{(.*?)}}/gi;

  const result = [];

  let temp;
  do {
    temp = regex.exec(template);
    if (temp) {
      // console.log(temp);
      // console.log(temp[1]);
      result.push(temp[1]);
    }
  } while (temp);

  return result;
}

export function mappingDoubleBracer(
  template: string,
  data: { [key: string]: any },
  option?: { defaultEmptyValue: string },
) {
  const regex = /.*?({{.*?}})/g;
  const match = template.match(regex);

  let replacedValue =
    match !== null ? match.map((item: string) => item.trim()).join(' ') : '';

  replacedValue = replacedValue.replaceAll(/{{(.*?)}}/gi, (match, key) => {
    key = key.trim();
    return data[key] !== null
      ? data[key] !== undefined
        ? data[key]
        : (option?.defaultEmptyValue ?? match)
      : match;
  });

  replacedValue = replacedValue.replaceAll(' /', '/');

  return replacedValue;
}

export function mappingDoubleBracerCustomText(
  template: string,
  data: any,
  option?: { defaultEmptyValue: string },
) {
  const regex = /.*?({{.*?}})/g;
  const match = template.match(regex);

  let replacedValue = template;
  // let replacedValue =
  //   match !== null ? match.map((item: string) => item.trim()).join(' ') : '';

  // const parsedData = {};
  // for (const [key, value] of Object.entries(data)) {
  //   parsedData[value.column] = value.value;
  // }

  const parsedData = data;

  replacedValue = replacedValue.replaceAll(/{{(.*?)}}/gi, (match, key) => {
    let usingKey = key.trim();
    let options = [];

    const checkOptions = usingKey.match(/(\w+)\[(.*?)\]/);

    if (checkOptions) {
      usingKey = checkOptions[1];
      options = checkOptions[2].split(',').map((item: string) => item.trim());
    }

    const mappingResult = usingKey.split('.').reduce((acc, key) => {
      if (acc && acc[key] !== undefined) {
        return acc[key];
      } else {
        return undefined;
      }
    }, parsedData);

    return mappingResult !== null
      ? mappingResult !== undefined
        ? mappingResult instanceof Date
          ? options.includes('dateOnly')
            ? formatDateToDDMMYYYY(mappingResult)
            : formatDateToDDMMYYYYHHMM(mappingResult, true)
          : typeof mappingResult === 'number'
            ? numberWithCommas(mappingResult)
            : mappingResult
        : (option?.defaultEmptyValue ?? match)
      : match;
  });

  replacedValue = replacedValue.replaceAll(' /', '/');

  return replacedValue;
}

export function isAllUpperCase(value: string) {
  return value === value.toUpperCase();
}

export function randomString(length: number = 10, stringOnly: boolean = false) {
  let result = '';
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz${
    stringOnly ? '' : `0123456789`
  }`;
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function mappingMailDynamicContent(
  template: string,
  data: { [key: string]: any },
  options: { [key: string]: any } = {},
): string {
  let result = template;

  // add border for table
  const style = `border: 1px solid black; border-collapse: collapse; padding: 4px;`;
  const tableStyle = `style="${style}"`;

  result = checkAndAppendStyleToTable(result, style);

  // result = result.replaceAll('<table>', `<table ${tableStyle}>`);
  result = result.replaceAll('<td>', `<td ${tableStyle}>`);

  // Regular expression to match table rows and data in braces
  const rowAndDataRegex =
    /<tr\b[^>]*>(?:(?!<\/tr>)[\s\S])*{[^}]*}(?:(?!<\/tr>)[\s\S])*<\/tr>/g;
  const dataInBracesRegex = /{([^}]*)}/g;
  const dataListToMappingRegex = /{(#[^}]*)}/g;
  const endMappingRegex = /{(\/[^}]*)}/g;

  // Extract table rows using the regular expression
  const rows = result.match(rowAndDataRegex);

  if (rows) {
    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Extract data in braces from each row
      const dataListKey = (
        ([...row.matchAll(dataListToMappingRegex)][0] ?? [])[1] ?? ''
      ).replace('#', '');

      if (dataListKey) {
        const endMappingPoint = row.match(endMappingRegex);

        if (data[dataListKey]) {
          const mappingRows = data[dataListKey].map((item, index) => {
            return row.replace(dataInBracesRegex, (_, key) => {
              let value = data[dataListKey][index][key] || '';

              if (value instanceof Date) {
                if (options['showTime']) {
                  value = formatDateToDDMMYYYYHHMM(value);
                } else {
                  value = formatDateToDDMMYYYY(value);
                }
              }

              return value;
            });
          });

          result = result.replace(row, mappingRows.join(''));
        }
      }
    }
  }

  return result;
}

export function checkAndAppendStyleToTable(htmlString, newStyle) {
  // Check if the HTML string contains a style attribute within a table tag
  const tableRegex = /<table[^>]*\sstyle\s*=\s*["'][^"']*["'][^>]*>/i;

  if (tableRegex.test(htmlString)) {
    // If style attribute is present, append the new style
    return htmlString.replace(
      /(style\s*=\s*["'][^"']*)["']/i,
      `$1 ${newStyle}"`,
    );
  } else {
    // If style attribute is not present, add the new style
    const tableWithStyle = htmlString.replace(
      /<table\s*([^>]*)>/i,
      `<table style="${newStyle}" $1>`,
    );
    return tableWithStyle;
  }
}

export function parseByMetaType(value: string, type: MetaType): any {
  try {
    switch (type) {
      case MetaType.number:
        return Number(value);

      case MetaType.boolean:
        return value === 'true';

      case MetaType.object:
        return JSON.parse(value);

      case MetaType.array:
        return JSON.parse(value); // Expecting a JSON stringified array

      case MetaType.date:
        return new Date(value);

      case MetaType.string:
      default:
        return value;
    }
  } catch (err) {
    console.error(`Failed to parse value "${value}" as ${type}:`, err);
    return undefined;
  }
}

export function checkExistAndCreateFileName(
  directory: string,
  originalName: string,
  createNew: boolean = true,
): string {
  const { name, ext } = path.parse(originalName);
  let filename = `${name}${ext}`;
  let counter = 1;

  while (fs.existsSync(path.join(directory, filename))) {
    filename = `${name}_${counter}${ext}`;
    counter++;
  }

  if (!createNew) {
    if (counter === 2) {
      return `${name}${ext}`;
    } else {
      return `${name}_${counter - 2}${ext}`;
    }
  }

  return filename;
}
