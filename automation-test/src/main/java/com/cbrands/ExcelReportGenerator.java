package com.cbrands;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
/**
 * 
 * @author Kazi Hossain
 *
 */
public class ExcelReportGenerator {
	public static void generateExcelReport(String destFileNameWithExtention, String DesiredPath)
			throws ParserConfigurationException, IOException, SAXException {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss_");

		Calendar cal = Calendar.getInstance();

		String time = dateFormat.format(cal.getTime());

		String path = ExcelReportGenerator.class.getClassLoader().getResource("./").getPath();

		path = path.replaceAll("bin", "src");

		File xmlFile = new File(path + "../../target/surefire-reports/testng-results.xml");

		XSSFWorkbook book = new XSSFWorkbook();

		DocumentBuilderFactory fact = DocumentBuilderFactory.newInstance();
		DocumentBuilder build = fact.newDocumentBuilder();

		Document doc = build.parse(xmlFile);

		doc.getDocumentElement().normalize();
		NodeList list = doc.getElementsByTagName("test");
		NodeList list1 = doc.getElementsByTagName("testng-results");

		XSSFCellStyle s1 = book.createCellStyle();
		XSSFCellStyle s2 = book.createCellStyle();
		XSSFCellStyle s3 = book.createCellStyle();
		XSSFCellStyle s4 = book.createCellStyle();
		XSSFCellStyle s5 = book.createCellStyle();
		for (int l = 0; l < list1.getLength(); l++) {
			Node report = list1.item(l);
			String rep = ((Element) report).getAttribute("total");
			String rep1 = ((Element) report).getAttribute("passed");
			String rep2 = ((Element) report).getAttribute("failed");
			String rep3 = ((Element) report).getAttribute("skipped");
			XSSFSheet sheet = book.createSheet("Reports Summary");
			XSSFRow row11 = sheet.createRow(0);
			XSSFCell namea = row11.createCell(0);
			namea.setCellStyle(s4);
			namea.setCellValue("Total TestCases");
			XSSFCell nameab = row11.createCell(1);
			nameab.setCellStyle(s4);
			nameab.setCellValue("Passed TestCases");
			XSSFCell nameac = row11.createCell(2);
			nameac.setCellStyle(s4);
			nameac.setCellValue("Failed TestCases");
			XSSFCell nameaad = row11.createCell(3);
			nameaad.setCellStyle(s4);
			nameaad.setCellValue("Skipped TestCases");
			int p = 1;

			XSSFRow row = sheet.createRow(p++);
			XSSFCell name = row.createCell(0);
			name.setCellValue(rep);
			name.setCellStyle(s5);
			XSSFCell name1 = row.createCell(1);
			name1.setCellValue(rep1);
			name1.setCellStyle(s1);

			XSSFCell name2 = row.createCell(2);
			name2.setCellValue(rep2);
			name2.setCellStyle(s2);

			XSSFCell name3 = row.createCell(3);
			name3.setCellValue(rep3);
			name3.setCellStyle(s3);
		}
		for (int s = 0; s < list.getLength(); s++) {
			Node test_suite = list.item(s);
			String test_suite_name = ((Element) test_suite).getAttribute("name");
			NodeList class_node_list = ((Element) test_suite).getElementsByTagName("class");

			XSSFSheet sheet = book.createSheet(test_suite_name);
			XSSFRow row1 = sheet.createRow(0);
			XSSFCell namea = row1.createCell(0);
			namea.setCellStyle(s3);
			namea.setCellValue("Executed TestCase");
			XSSFCell nameac = row1.createCell(1);
			nameac.setCellStyle(s3);
			nameac.setCellValue("Status Pass/Fail");
			XSSFCell nameaca = row1.createCell(2);
			nameaca.setCellStyle(s3);
			nameaca.setCellValue("Exception Message/Failed Due To");
			XSSFCell nameaaa = row1.createCell(3);
			nameaaa.setCellStyle(s3);
			nameaaa.setCellValue("Execution Started At");
			XSSFCell nameaaaa = row1.createCell(4);
			nameaaaa.setCellStyle(s3);
			nameaaaa.setCellValue("Execution Finished At");
			XSSFCell nameaaaa1 = row1.createCell(5);
			nameaaaa1.setCellStyle(s3);
			nameaaaa1.setCellValue("Duration in MilliSeconds");

			int i = 1;
			for (int j = 0; j < class_node_list.getLength(); j++) {
				Node class_node = class_node_list.item(j);
				String class_name = ((Element) class_node).getAttribute("name");
				NodeList test_method_list = ((Element) class_node).getElementsByTagName("test-method");
				for (int k = 0; k < test_method_list.getLength(); k++) {
					Node test_method_node = test_method_list.item(k);
					String isConfig = ((Element) test_method_node).getAttribute("is-config");
					if (isConfig.equalsIgnoreCase("true")) continue;
					String test_method_name = ((Element) test_method_node).getAttribute("name");
					String test_method_status = ((Element) test_method_node).getAttribute("status");
					String test_method_start_time = ((Element) test_method_node).getAttribute("started-at");
					String test_method_finish_time = ((Element) test_method_node).getAttribute("finished-at");
					String test_method_millis = ((Element) test_method_node).getAttribute("duration-ms");

					s1.setFillForegroundColor((short) 11);
					s2.setFillForegroundColor((short) 10);
					s1.setFillPattern((short) 1);
					s2.setFillPattern((short) 1);
					s3.setFillForegroundColor((short) 54);
					s3.setFillPattern((short) 10);
					s4.setFillForegroundColor((short) 49);
					s4.setFillPattern((short) 10);
					s5.setFillForegroundColor((short) 13);
					s5.setFillPattern((short) 1);
					XSSFRow row = sheet.createRow(i++);
					XSSFCell name = row.createCell(0);
					name.setCellValue(class_name + "." + test_method_name);
					XSSFCell status = row.createCell(1);
					status.setCellValue(test_method_status);
					XSSFCell name1 = row.createCell(3);
					name1.setCellValue(test_method_start_time);
					XSSFCell name3 = row.createCell(4);
					name3.setCellValue(test_method_finish_time);
					XSSFCell name31 = row.createCell(5);
					name31.setCellValue(test_method_millis);
					if ("fail".equalsIgnoreCase(test_method_status)) {
						status.setCellStyle(s2);
					} else {
						status.setCellStyle(s1);
					}
					status.setCellValue(test_method_status);
					String exp_message = "";
					if ("fail".equalsIgnoreCase(test_method_status)) {
						NodeList exp_node_list = ((Element) test_method_node).getElementsByTagName("exception");
						Node exp_node = exp_node_list.item(0);
						exp_message = ((Element) exp_node).getAttribute("class");
						XSSFCell exp_cel = row.createCell(2);
						exp_cel.setCellValue(exp_message);
					}
				}
			}
		}
		FileOutputStream fout = new FileOutputStream(new File(DesiredPath + "/" + time + destFileNameWithExtention));
		book.write(fout);
		System.out.println(destFileNameWithExtention + " -- Excel Report has been generated at :" + DesiredPath);
		fout.close();
	}

	public static void main(String[] args) throws ParserConfigurationException, IOException, SAXException {
		ExcelReportGenerator.generateExcelReport("Automation.xlsx", ".");
	}
}
