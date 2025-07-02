import { DateType } from './date.util';

export function removeThousandSeparators(inputString) {
  // Use a regular expression to match commas (,) as thousand separators
  const regex = /,/g;

  // Use the replace method to remove all occurrences of commas
  return inputString ? inputString.replace(regex, '') : null;
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

export function formatSingleNumberWithLeadingZeros(number: number) {
  return number.toString().padStart(2, '0');
}

export enum OptionChangeType {
  increase = 'increase',
  decrease = 'decrease',
}

export enum OptionChangeCalculationType {
  percent = 'percent',
  direct = 'direct',
}

export function getChangeValueWithOption(
  value: number,
  optionChangeType: OptionChangeType,
  optionChangeCalculationType: OptionChangeCalculationType,
  changeValue: number,
) {
  let result = 0;

  if (optionChangeCalculationType === OptionChangeCalculationType.percent) {
    result = (changeValue * value) / 100;
  } else if (
    optionChangeCalculationType === OptionChangeCalculationType.direct
  ) {
    result = changeValue;
  }

  if (optionChangeType === OptionChangeType.decrease) {
    result = -result;
  } else if (optionChangeType === OptionChangeType.increase) {
    result = result;
  } else {
    // un-change
    result = 0;
  }

  return result;
}

export function calcAssetPriceByDateType(
  dateType: DateType,
  basePricePerCustomer: number,
  optionChangeType: OptionChangeType,
  optionChangeCalculationType: OptionChangeCalculationType,
  changeValue: number,
  condition: DateType[],
) {
  if (condition.length === 0 || condition.includes(dateType)) {
    return getChangeValueWithOption(
      basePricePerCustomer,
      optionChangeType,
      optionChangeCalculationType,
      changeValue,
    );
  }

  return 0;
}
