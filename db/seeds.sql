USE employees_db;

INSERT INTO department(name)
VALUES ('Sales'), ('Engineering'), ('Legal'), ('Finance'), ('Executive'); 

INSERT INTO role(title, salary, department_id)
VALUES ('Salesperson', 80000, 1),
        ('Sales Team Lead', 150000, 1),
        ('Software Engineer', 120000, 2),
        ('Back End Developer', 95000, 2), 
        ('Lawyer', 190000, 3),
        ('Accountant', 120000, 4),
        ('CFO', 275000, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Adriana', 'Fitzpatrick', 2, NULL),
        ('Isaac', 'Cooper', 1, 1),
        ('Madeline', 'Williams', 3, NULL),
        ('Alex', 'Wilson', 4, 3),
        ('Ben', 'Smith', 4, 3 ), 
        ('Claire' , 'Johnson', 5, NULL),
        ('Ralph', 'Donovan', 7, NULL),
        ('Lisa', 'Reeves', 6, 7);
