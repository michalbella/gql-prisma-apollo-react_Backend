const users = [
	{
		id: '1',
		name: 'Michal',
		email: 'bellamichal6@gmail.com',
		age: 26
	},
	{
		id: '2',
		name: 'Sarah',
		email: 'sarah6@gmail.com'
	},
	{
		id: '3',
		name: 'Mike',
		email: 'mike@gmail.com'
	}
];

const posts = [
	{
		id: '10',
		title: 'GraphQL',
		body: 'how to use GraphQL',
		published: true,
		author: '1',
		comments: '21'
	},
	{
		id: '11',
		title: 'JavaScript',
		body: 'how to use JavaScript',
		published: false,
		author: '2',
		comments: '23'
	},
	{
		id: '12',
		title: 'Java',
		body: 'how to use Java',
		published: true,
		author: '3',
		comments: '21'
	}
];

const comments = [
	{
		id: '21',
		text: 'toto je koment 1',
		author: '3',
		post: '10'
	},
	{
		id: '22',
		text: 'toto je koment 2',
		author: '3',
		post: '10'
	},
	{
		id: '23',
		text: 'toto je koment 3',
		author: '1',
		post: '11'
	},
	{
		id: '24',
		text: 'toto je koment 4',
		author: '2',
		post: '12'
	}
];

const data = {
    users,
    posts,
    comments
}

export { data as default }