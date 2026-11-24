import type { folder } from '#lib/components/folder.ts';

export const folders: folder[] = [
	{
		id: '0',
		name: 'polski',
		parentid: null,
		new: 3,
		learn: 1,
		due: 1,
		nextCard: '0',
		private: false,
		created: '2026-11-09T22:10:00'
	},
	{
		id: '1',
		name: 'matematyka',
		parentid: null,
		new: 2,
		learn: 1,
		due: 1,
		nextCard: '3',
		private: true,
		created: '2026-11-09T23:10:00'
	},
	{
		id: '2',
		name: 'informatyka',
		parentid: null,
		new: 2,
		learn: 0,
		due: 0,
		nextCard: '9',
		private: false,
		created: '2026-11-10T10:10:50'
	},
	{
		id: '3',
		name: 'cpp',
		parentid: '2',
		new: 1,
		learn: 1,
		due: 0,
		nextCard: '11',
		private: true,
		created: '2026-11-10T10:14:47'
	},
	{
		id: '4',
		name: 'python',
		parentid: '2',
		new: 1,
		learn: 0,
		due: 1,
		nextCard: '13',
		private: false,
		created: '2026-11-12T22:50:00'
	},
	{
		id: '5',
		name: 'Biologia',
		parentid: null,
		new: 2,
		learn: 0,
		due: 0,
		nextCard: '15',
		private: false,
		created: '2024-09-10T10:10:50'
	},
	{
		id: '6',
		name: 'Komórki',
		parentid: '5',
		new: 1,
		learn: 1,
		due: 0,
		nextCard: '17',
		private: false,
		created: '2025-09-10T10:14:47'
	},
	{
		id: '7',
		name: 'Sacharydy',
		parentid: '5',
		new: 0,
		learn: 1,
		due: 1,
		nextCard: '19',
		private: false,
		created: '2025-09-12T22:50:00'
	},
	{
		id: '8',
		name: 'Metabolizm',
		parentid: '5',
		new: 1,
		learn: 0,
		due: 1,
		nextCard: '21',
		private: false,
		created: '2025-09-12T22:50:00'
	},
	{
		id: '9',
		name: 'Oddychanie komórkowe',
		parentid: '8',
		new: 2,
		learn: 0,
		due: 0,
		nextCard: '23',
		private: false,
		created: '2025-09-12T22:50:00'
	},
	{
		id: '10',
		name: 'Fotosynteza',
		parentid: '8',
		new: 0,
		learn: 1,
		due: 1,
		nextCard: '25',
		private: false,
		created: '2025-09-12T22:50:00'
	}
];
