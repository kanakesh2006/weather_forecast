import { db } from '@/lib/db';
import Papa from 'papaparse';

export class ExportService {
  /**
   * Generates JSON export payload of search logs
   */
  static async exportJson(limit = 1000) {
    const logs = await db.weatherHistory.findMany({
      take: limit,
      orderBy: { searchedAt: 'desc' },
    });

    await db.exportLogs.create({
      data: { format: 'JSON', recordCount: logs.length, status: 'SUCCESS' },
    });

    return JSON.stringify(logs, null, 2);
  }

  /**
   * Generates formatted CSV export string of search logs
   */
  static async exportCsv(limit = 1000) {
    const logs = await db.weatherHistory.findMany({
      take: limit,
      orderBy: { searchedAt: 'desc' },
    });

    const flattened = logs.map((log) => ({
      ID: log.id,
      Location: log.location,
      City: log.city || '',
      Country: log.country || '',
      Latitude: log.latitude,
      Longitude: log.longitude,
      'Temperature (°C)': log.temperature,
      'Humidity (%)': log.humidity,
      'Pressure (hPa)': log.pressure,
      'Visibility (km)': log.visibility,
      'Wind Speed (km/h)': log.windSpeed,
      'Wind Direction (°)': log.windDirection,
      Condition: log.weatherCondition,
      Description: log.weatherDescription,
      'UV Index': log.uvIndex,
      'Air Quality': log.airQuality,
      Sunrise: log.sunrise,
      Sunset: log.sunset,
      Notes: log.notes || '',
      'Searched At': log.searchedAt.toISOString(),
    }));

    await db.exportLogs.create({
      data: { format: 'CSV', recordCount: logs.length, status: 'SUCCESS' },
    });

    return Papa.unparse(flattened);
  }

  /**
   * Generates structured PDF export byte stream using jsPDF
   */
  static async exportPdf(limit = 1000) {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const logs = await db.weatherHistory.findMany({
      take: limit,
      orderBy: { searchedAt: 'desc' },
    });

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Document Header
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text('Weather Intelligence Dashboard - Search History Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Generated on: ${new Date().toLocaleString()} | Total Records: ${logs.length}`, 14, 26);

    const tableRows = logs.map((log) => [
      log.location,
      `${log.temperature}°C`,
      `${log.humidity}%`,
      `${log.windSpeed} km/h`,
      log.weatherCondition,
      log.airQuality,
      new Date(log.searchedAt).toLocaleDateString(),
      log.notes || '-',
    ]);

    autoTable(doc, {
      startY: 32,
      head: [['Location', 'Temp', 'Humidity', 'Wind', 'Condition', 'AQI', 'Date', 'Notes']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    await db.exportLogs.create({
      data: { format: 'PDF', recordCount: logs.length, status: 'SUCCESS' },
    });

    return Buffer.from(doc.output('arraybuffer'));
  }
}
