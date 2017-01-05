package com.cbrands.helper;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.Set;

/**
 * The Class PropertiesCache.
 */
public class PropertiesCache {
	
	/** The config prop. */
	private final Properties configProp = new Properties();

	/**
	 * Instantiates a new properties cache.
	 */
	private PropertiesCache() {
		InputStream in = this.getClass().getClassLoader().getResourceAsStream("automation.properties");
		try {
			configProp.load(in);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * The Class LazyHolder.
	 */
	private static class LazyHolder {
		
		/** The Constant INSTANCE. */
		private static final PropertiesCache INSTANCE = new PropertiesCache();
	}

	/**
	 * Gets the single instance of PropertiesCache.
	 *
	 * @return single instance of PropertiesCache
	 */
	public static PropertiesCache getInstance() {
		return LazyHolder.INSTANCE;
	}

	/**
	 * Gets the property.
	 *
	 * @param key the key
	 * @return the property
	 */
	public String getProperty(String key) {
		return configProp.getProperty(key);
	}

	/**
	 * Gets the all property names.
	 *
	 * @return the all property names
	 */
	public Set<String> getAllPropertyNames() {
		return configProp.stringPropertyNames();
	}

	/**
	 * Contains key.
	 *
	 * @param key the key
	 * @return true, if successful
	 */
	public boolean containsKey(String key) {
		return configProp.containsKey(key);
	}
}
