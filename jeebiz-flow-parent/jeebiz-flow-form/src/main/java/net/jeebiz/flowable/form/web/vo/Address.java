package net.jeebiz.flowable.form.web.vo;

import net.formio.binding.ArgumentName;

public class Address {
	
	private final String street;
	private final String city;
	private final Integer zipCode;

	public Address(@ArgumentName("street") String street, @ArgumentName("city") String city,
			@ArgumentName("zipCode") Integer zipCode) {
		this.street = street;
		this.city = city;
		this.zipCode = zipCode;
	}

	public String getStreet() {
		return street;
	}

	public String getCity() {
		return city;
	}

	public Integer getZipCode() {
		return zipCode;
	}
}