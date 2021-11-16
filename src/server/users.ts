import faker from 'faker';
import type { Users, User, Email } from '../typings/user';

const USERS = 200;
const users: Users = {};

for (let i = 0; i < USERS; i++) {
	faker.seed(i);

	const gender = faker.datatype.boolean() ? 'male' : 'female'; // We need a definite gender for the name
	const firstName = faker.name.firstName(gender === 'male' ? 0 : 1);
	const lastName = faker.name.lastName(gender === 'male' ? 0 : 1);
	const bioLength = faker.datatype.number({ min: 15, max: 255 });

	const user: User = {
		person: {
			firstName: firstName,
			lastName: lastName,
			gender: gender,
		},
		user: {
			email: faker.unique(faker.internet.email, [firstName, lastName]) as Email,
			username: faker.unique(faker.internet.userName, [firstName, lastName]),
			password: faker.internet.password(undefined, faker.datatype.boolean()),
			bio: bioLength === 15 ? false : faker.lorem.words(bioLength),
		},
		address: {
			country: faker.address.country(),
			city: faker.address.city(),
			address: `${faker.address.streetName()} ${HouseNumber()}`,
			zip: faker.address.zipCode(),
		},
	};

	users[faker.unique(faker.datatype.uuid)] = user;
}

// TODO: This Function isn't good, but it works.
function HouseNumber() {
	const base = Math.random() + 1; // have the number be above one

	const multiplier = (Math.random() + 1) * Math.random() * 5;

	return Math.max(
		1,
		Math.round(Math.pow(Math.log(base * 100) * multiplier, 1.5)),
	);
}

export default users;
