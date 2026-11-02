ALTER TABLE users ADD COLUMN bio TEXT;

UPDATE users SET bio = 'Designing calm, useful products for teams that care about the details.' WHERE id = 1;
UPDATE users SET bio = 'Brand strategist helping ambitious teams find their voice.' WHERE id = 2;
UPDATE users SET bio = 'Creative director building identities that feel inevitable.' WHERE id = 3;
UPDATE users SET bio = 'Software engineer turning complex ideas into simple tools.' WHERE id = 4;
