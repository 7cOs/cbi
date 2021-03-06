package com.cbrands.listener;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.StringTokenizer;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.testng.IReporter;
import org.testng.IResultMap;
import org.testng.ISuite;
import org.testng.ISuiteResult;
import org.testng.ITestContext;
import org.testng.ITestResult;
import org.testng.xml.XmlSuite;

import com.cbrands.helper.PropertiesCache;
import com.relevantcodes.extentreports.ExtentReports;
import com.relevantcodes.extentreports.ExtentTest;
import com.relevantcodes.extentreports.LogStatus;

/**
 * The listener interface for receiving testNGCustomReport events.
 * The class that is interested in processing a testNGCustomReport
 * event implements this interface, and the object created
 * with that class is registered with a component using the
 * component's <code>addTestNGCustomReportListener<code> method. When
 * the testNGCustomReport event occurs, that object's appropriate
 * method is invoked.
 *
 * @author Kazi Hossain
 */
public class TestNGCustomReportListener implements IReporter {
    
    /** The log. */
    private Log log = LogFactory.getLog(TestNGCustomReportListener.class);

	/** The Constant EXTENT_REPORT_TEST_NG_HTML. */
	private static final String EXTENT_REPORT_TEST_NG_HTML = "ExtentReportTestNG.html";
	
	/** The extent. */
	private ExtentReports extent;
	
	/** The mail server properties. */
	static Properties mailServerProperties;
	
	/** The get mail session. */
	static Session getMailSession;
	
	/** The generate mail message. */
	static MimeMessage generateMailMessage;

	/* (non-Javadoc)
	 * @see org.testng.IReporter#generateReport(java.util.List, java.util.List, java.lang.String)
	 */
	@Override
	public void generateReport(List<XmlSuite> xmlSuites, List<ISuite> suites, String outputDirectory) {
		extent = new ExtentReports(outputDirectory + File.separator + EXTENT_REPORT_TEST_NG_HTML, true);

		for (ISuite suite : suites) {
			Map<String, ISuiteResult> result = suite.getResults();

			for (ISuiteResult r : result.values()) {
				ITestContext context = r.getTestContext();

				buildTestNodes(context.getPassedTests(), LogStatus.PASS);
				buildTestNodes(context.getFailedTests(), LogStatus.FAIL);
				buildTestNodes(context.getSkippedTests(), LogStatus.SKIP);
			}
		}

		extent.flush();
		extent.close();
		try {
			String status = PropertiesCache.getInstance().getProperty("send.email");
			if (status.equalsIgnoreCase("true")) {
				generateAndSendEmail(outputDirectory);
				log.info("e-Mail output dir: " + outputDirectory);
				log.info("e-Mail sent.");
			}
		} catch (AddressException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * Builds the test nodes.
	 *
	 * @param tests the tests
	 * @param status the status
	 */
	private void buildTestNodes(IResultMap tests, LogStatus status) {
		ExtentTest test;

		if (tests.size() > 0) {
			for (ITestResult result : tests.getAllResults()) {
				test = extent.startTest(result.getMethod().getMethodName());

				test.getTest().setStartedTime(getTime(result.getStartMillis()));
				test.getTest().setEndedTime(getTime(result.getEndMillis()));
				
				for (String group : result.getMethod().getGroups())
					test.assignCategory(group);

				String message = "Test " + status.toString().toLowerCase() + "ed";

				if (result.getThrowable() != null)
					message = result.getThrowable().getMessage();

				test.log(status, message);

				extent.endTest(test);
			}
		}
	}

	/**
	 * Gets the time.
	 *
	 * @param millis the millis
	 * @return the time
	 */
	private Date getTime(long millis) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(millis);
		return calendar.getTime();
	}

	/**
	 * Generate and send email.
	 *
	 * @param outdir the outdir
	 * @throws AddressException the address exception
	 * @throws MessagingException the messaging exception
	 * @throws IOException Signals that an I/O exception has occurred.
	 */
	public void generateAndSendEmail(String outdir) throws AddressException, MessagingException, IOException {
		mailServerProperties = System.getProperties();
		mailServerProperties.put("mail.smtp.port", "587");
		mailServerProperties.put("mail.smtp.auth", "true");
		mailServerProperties.put("mail.smtp.starttls.enable", "true");
		getMailSession = Session.getDefaultInstance(mailServerProperties, null);
		generateMailMessage = new MimeMessage(getMailSession);
		StringTokenizer tokenizer = new StringTokenizer(PropertiesCache.getInstance().getProperty("send.email.to"), ",");
		while (tokenizer.hasMoreTokens()) {
	         generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(tokenizer.nextToken()));
		}
		generateMailMessage.setSubject("TestNG Customized Report. " + new Date());
		BufferedReader br = new BufferedReader(new FileReader(new File(outdir + File.separator + "emailable-report.html")));
		String emailBody = IOUtils.toString(br);
		generateMailMessage.setContent(emailBody, "text/html");
		Transport transport = getMailSession.getTransport("smtp");
		transport.connect(PropertiesCache.getInstance().getProperty("smtp.address"), 
						  PropertiesCache.getInstance().getProperty("smtp.userid"), 
						  PropertiesCache.getInstance().getProperty("smtp.password"));
		transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
		transport.close();
	}
}
