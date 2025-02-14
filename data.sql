DROP DATABASE IF EXISTS biztime;
CREATE DATABASE biztime;
\c biztime;

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS companies_industries;

CREATE TABLE industries (
    in_code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE companies_industries (
    company_code text REFERENCES companies(code) ON DELETE CASCADE ON UPDATE CASCADE,
    industry_code text REFERENCES industries(in_code) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (company_code, industry_code)
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE ON UPDATE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > 0))
);

INSERT INTO industries (in_code, name, description)
VALUES ('tech', 'Technology', 'Tech-related companies'),
       ('software', 'Software', 'Software-related companies');

INSERT INTO companies (code, name, description)
VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
       ('ibm', 'IBM', 'Big blue.');

INSERT INTO companies_industries (company_code, industry_code)
VALUES ('apple', 'tech'),    
       ('apple', 'software'), 
       ('ibm', 'software');   

INSERT INTO invoices (comp_code, amt, paid, paid_date)
VALUES ('apple', 100, false, null),
       ('apple', 200, false, null),
       ('apple', 300, true, '2018-01-01'),
       ('ibm', 400, false, null);
