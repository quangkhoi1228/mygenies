export function calculateCRC(str: string) {
  const polynomial = 0x1021;
  let crc = 0xffff;

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    crc ^= charCode << 8;

    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ polynomial : crc << 1;
    }
  }

  const result = crc & 0xffff;
  return result.toString(16).toLocaleUpperCase().padStart(4, '0');
}
