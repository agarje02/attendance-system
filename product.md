Product Design

- main page to show what does product do
- user login and signup
- user can create a school
- user can create a department
- department can have classes
- user can create  class with department or without department , with school and without school, here school is to manage the multiple department, can't create department without school
- class will have owner , teachers and students ,className
- owner can add student and teacher to the class
- class can have multiple students and teachers
- for the role system we will go for hirarchy , user(owner) can create a student or teacher which have username and password, these student and teacher are belong to the current user , these student and teacher will have limited access, for ex. student can only be student ,here in the form we will have username , password and role and optional department,school and class,managed users can not create anything
- these students can apply for class and department, owner and teacher can let them in also teacher can add students to the class which are created by owner , also can approve request of student
- a new user can also create class directly and add any students (without creating school or department)
- here add will be request and accept between student and teacher, also owner can add student to any class directly, teacher also can add
now class is the main part, class will have students , teachers and owner
- teacher can add , links to the class, description 
- now teacher or owner can shedule a class, shedule class will be different entity in the database, this shedule class will be live, teacher can mark student status as absent or present,teacher can end the class, add summary like any text and what he is teached or teaching , and end the class, after ending this will stored in database,no one can edit it
- these shedule calsses will have class id or related to class
- shedule classes will be in in-memory after created and in databse after ended
