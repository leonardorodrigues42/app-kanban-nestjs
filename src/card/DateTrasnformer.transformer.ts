import { ValueTransformer } from 'typeorm';

export class DateTransformer implements ValueTransformer {
  to(value: Date): string {
    console.log(value);
    const date = new Date(value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    console.log(year, month, day);
    return `${day}-${month}-${year}`;
  }

  from(value: string): Date {
    const [day, month, year] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
