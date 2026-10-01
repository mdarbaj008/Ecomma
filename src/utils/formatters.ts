export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIndianNumber(num: number): string {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function generateAwb(): string {
  const couriers = ['DELHIVERY', 'BLUEDART', 'EKART', 'SHADOWFAX'];
  const prefix = couriers[Math.floor(Math.random() * couriers.length)];
  const randNum = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}-${randNum}`;
}

export interface PincodeDeliveryInfo {
  valid: boolean;
  city: string;
  state: string;
  estimatedDays: number;
  deliveryDateStr: string;
  codAvailable: boolean;
  shippingFee: number;
}

export function checkPincodeServiceability(pincode: string): PincodeDeliveryInfo {
  const cleanPin = pincode.trim();
  const isValid = /^[1-9][0-9]{5}$/.test(cleanPin);

  if (!isValid) {
    return {
      valid: false,
      city: '',
      state: '',
      estimatedDays: 0,
      deliveryDateStr: '',
      codAvailable: false,
      shippingFee: 0,
    };
  }

  // Derive realistic state from 1st digit of Indian PIN code
  const firstDigit = cleanPin[0];
  let state = 'Maharashtra';
  let city = 'Mumbai';
  let days = 3;

  switch (firstDigit) {
    case '1':
      state = 'Delhi NCR';
      city = 'New Delhi';
      days = 2;
      break;
    case '2':
      state = 'Uttar Pradesh';
      city = 'Lucknow';
      days = 3;
      break;
    case '3':
      state = 'Rajasthan';
      city = 'Jaipur';
      days = 3;
      break;
    case '4':
      state = 'Maharashtra';
      city = 'Mumbai';
      days = 2;
      break;
    case '5':
      state = 'Telangana';
      city = 'Hyderabad';
      days = 3;
      break;
    case '6':
      state = 'Tamil Nadu';
      city = 'Chennai';
      days = 3;
      break;
    case '7':
      state = 'West Bengal';
      city = 'Kolkata';
      days = 4;
      break;
    case '8':
      state = 'Bihar';
      city = 'Patna';
      days = 4;
      break;
    case '9':
      state = 'Assam';
      city = 'Guwahati';
      days = 5;
      break;
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);

  const deliveryDateStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(deliveryDate);

  return {
    valid: true,
    city,
    state,
    estimatedDays: days,
    deliveryDateStr,
    codAvailable: true,
    shippingFee: 0, // Free above ₹499
  };
}
