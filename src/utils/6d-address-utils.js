/**
 * Encodes a latitude/longitude pair into a 6D Address string.
 * Example: lat: 2.0432, lng: 45.3125 => "03-41-32"
 * @param {number} latitude The latitude.
 * @param {number} longitude The longitude.
 * @returns {string} The formatted 6D Address.
 */
export function encode6D(latitude, longitude) {
  const latStr = latitude.toString().split('.')[1] || '';
  const lngStr = longitude.toString().split('.')[1] || '';

  const p1_lat = latStr.charAt(0) || '0';
  const p1_lng = lngStr.charAt(0) || '0';

  const p2_lat = latStr.charAt(1) || '0';
  const p2_lng = lngStr.charAt(1) || '0';

  const p3_lat = latStr.charAt(2) || '0';
  const p3_lng = lngStr.charAt(2) || '0';

  const pair1 = `${p1_lat}${p1_lng}`;
  const pair2 = `${p2_lat}${p2_lng}`;
  const pair3 = `${p3_lat}${p3_lng}`;

  return `${pair1}-${pair2}-${pair3}`;
}

/**
 * Decodes a 6D Address string into an approximate latitude/longitude object.
 * Assumes a base coordinate of Mogadishu (lat: 2, lng: 45).
 * Example: "03-41-32" => { lat: 2.043, lng: 45.312 }
 * @param {string} sixDCode The 6D Address string (e.g., "03-41-32").
 * @returns {{lat: number, lng: number} | null} The decoded coordinate object or null if invalid.
 */
export function decode6D(sixDCode) {
  const cleanedCode = sixDCode.replace(/-/g, '');
  if (cleanedCode.length !== 6 || !/^\d+$/.test(cleanedCode)) {
    return null; // Invalid format
  }

  const latDecimal = `0.${cleanedCode[0]}${cleanedCode[2]}${cleanedCode[4]}`;
  const lngDecimal = `0.${cleanedCode[1]}${cleanedCode[3]}${cleanedCode[5]}`;

  const baseLat = 2;
  const baseLng = 45;

  return {
    lat: baseLat + parseFloat(latDecimal),
    lng: baseLng + parseFloat(lngDecimal),
  };
}