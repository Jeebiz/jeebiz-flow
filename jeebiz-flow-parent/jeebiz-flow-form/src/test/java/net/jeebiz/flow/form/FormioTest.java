package net.jeebiz.flow.form;

import net.formio.FormMapping;
import net.formio.Forms;
import net.jeebiz.flowable.form.web.vo.Person;

public class FormioTest {

	public static void main(String[] args) {
		
		 FormMapping<Person> personForm = Forms.automatic(Person.class, "person").build();
		 
		 System.out.println(personForm.toString());
		 
	}
	
}
