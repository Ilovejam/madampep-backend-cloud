// api/utils/zodiac.js

function getZodiacSign(day, month) {
  const zodiacSigns = [
      { sign: 'Oğlak', start: '12-22', end: '01-20' },
      { sign: 'Kova', start: '01-21', end: '02-18' },
      { sign: 'Balık', start: '02-19', end: '03-20' },
      { sign: 'Koç', start: '03-21', end: '04-20' },
      { sign: 'Boğa', start: '04-21', end: '05-20' },
      { sign: 'İkizler', start: '05-21', end: '06-21' },
      { sign: 'Yengeç', start: '06-22', end: '07-22' },
      { sign: 'Aslan', start: '07-23', end: '08-23' },
      { sign: 'Başak', start: '08-24', end: '09-23' },
      { sign: 'Terazi', start: '09-24', end: '10-23' },
      { sign: 'Akrep', start: '10-24', end: '11-22' },
      { sign: 'Yay', start: '11-23', end: '12-21' }
  ];
  const date = `${month}-${day}`;
  for (const zodiac of zodiacSigns) {
      if ((date >= zodiac.start && month != 12) || (date <= zodiac.end && month != 1)) {
          return zodiac.sign;
      }
  }
  return 'Bilinmiyor';
}

module.exports = getZodiacSign;
