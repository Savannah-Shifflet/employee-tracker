INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Legal'), ('Finance'), ('Executive'); 

INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 80000, 1),
        ('Software Engineer', 120000, 2),
        ('Back End Developer', 95000, 2), 
        ('Lawyer', 190000, 3),
        ('Accountant', 120000, 4),
        ('CFO', 275000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Adriana', 'Fitzpatrick', ),
        ('Isaac', 'Cooper' , ),
        ('Madeline', 'Williams' , ),
        ('Alex', 'Wilson' , ),
        ('Ben', 'Smith' , ), 
        ('Claire' , 'Johnson', , ),
        ('Ralph', 'Donovan', , ),
        ('Lisa', 'Reeves', , );
