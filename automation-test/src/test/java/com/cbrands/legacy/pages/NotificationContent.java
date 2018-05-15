package com.cbrands.legacy.pages;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class NotificationContent {
	private String storeName;
	private String productSku;
	private String type = "";
	private String sentByPersonName;
	private String sentByDate;

	public NotificationContent (){
		super();
	}

	public NotificationContent(String storeName, String productSku, String type, String sentByPersonName, String sentByDate) {
		super();
		this.storeName = storeName;
		this.productSku = productSku;
		this.type = type;
		this.sentByPersonName = sentByPersonName;
		this.sentByDate = sentByDate;
	}

	public String getStoreName() {
		return storeName.toUpperCase();
	}

	public void setStoreName(String storeName) {
		this.storeName = storeName.toUpperCase();
	}

	public String getProductSku() {
		return productSku.toUpperCase();
	}

	public void setProductSku(String productSku) {
		this.productSku = productSku.toUpperCase();
	}

	public String getType() {
		return type.toUpperCase();
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSentByPersonName() {
		return sentByPersonName.toUpperCase();
	}

	public void setSentByPersonName(String sentByPersonName) {
		this.sentByPersonName = sentByPersonName.toUpperCase();
	}

	public String getSentByDate() {
		return sentByDate.toUpperCase();
	}

	public void setSentByDate(String sentByDate) {
		this.sentByDate = sentByDate.toUpperCase();
	}

	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this);
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((productSku == null) ? 0 : productSku.hashCode());
		result = prime * result + ((sentByDate == null) ? 0 : sentByDate.hashCode());
		result = prime * result + ((sentByPersonName == null) ? 0 : sentByPersonName.hashCode());
		result = prime * result + ((storeName == null) ? 0 : storeName.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		NotificationContent other = (NotificationContent) obj;
		if (productSku == null) {
			if (other.productSku != null)
				return false;
		} else if (!productSku.equals(other.productSku))
			return false;
		if (sentByDate == null) {
			if (other.sentByDate != null)
				return false;
		} else if (!sentByDate.equals(other.sentByDate))
			return false;
		if (sentByPersonName == null) {
			if (other.sentByPersonName != null)
				return false;
		} else if (!sentByPersonName.equals(other.sentByPersonName))
			return false;
		if (storeName == null) {
			if (other.storeName != null)
				return false;
		} else if (!storeName.equals(other.storeName))
			return false;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		return true;
	}
}
