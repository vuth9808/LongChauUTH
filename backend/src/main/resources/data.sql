-- Seed roles and users
INSERT INTO roles (id, name) VALUES (1, 'ADMIN') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (id, name) VALUES (2, 'STAFF') ON DUPLICATE KEY UPDATE name=name;

INSERT INTO users (id, username, password, enabled)
VALUES
(1, 'admin', '$2a$10$u1JmGha6oE/6pKqvZQ.Z9uf9om7mMzWz0j2JIVyZ6t5vLhxN6.GG6', true),
(2, 'staff', '$2a$10$8FQ4b4xyYHPN9sGJtq1pUuCz4fSO8yJkX7nlBavIbJNUmMPL1MF3y', true)
ON DUPLICATE KEY UPDATE username=username;

-- user_roles
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1) ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2) ON DUPLICATE KEY UPDATE user_id=user_id;
