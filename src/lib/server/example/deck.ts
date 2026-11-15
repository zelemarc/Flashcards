import type { folder } from "#lib/components/folder.ts";

export const folders: folder[] = [
  {
  id: '0',
	name: 'polski',
  subfolders: null,
  new: 0,
  learn: 0,
  due: 0,
  private: false,
  created: '2026-11-09T22:10:00'
},
{
  id: '1',
	name: 'matematyka',
  subfolders: null,
  new: 0,
  learn: 0,
  due: 0,
  private: true,
  created: '2026-11-09T23:10:00'
  },
  {
			id: '2',
			name: 'informatyka',
			subfolders: [
				{ id: '3', name: 'cpp',subfolders: null, new: 0, learn: 0, due: 0, private: true, created: '2026-11-10T10:14:47' },
				{ id: '4', name: 'python',subfolders: null, new: 0, learn: 0, due: 0, private: false, created: '2026-11-12T22:50:00' }
			],
			new: 0,
			learn: 0,
			due: 0,
      private: false,
			created: '2026-11-10T10:10:50'
  },
  {
			id: '5',
			name: 'Biologia',
			subfolders: [
				{ id: '6', name: 'Komórki',subfolders: null, new: 0, learn: 0, due: 0, private: false, created: '2025-09-10T10:14:47' },
				{ id: '7', name: 'Sacharydy',subfolders: null, new: 0, learn: 0, due: 0, private: false, created: '2025-09-12T22:50:00' },
        {
          id: '8', name: 'Metabolizm', subfolders: [
            { id: '9', name: 'Oddychanie komórkowe', subfolders: null, new: 0, learn: 0, due: 0, private: false, created: '2025-09-12T22:50:00' },
            { id: '10', name: 'Fotosynteza',subfolders: null, new: 0, learn: 0, due: 0, private: false, created: '2025-09-12T22:50:00' },
          ], new: 0, learn: 0, due: 0, private: false, created: '2025-09-12T22:50:00' }
    ],
			new: 0,
			learn: 0,
			due: 0,
      private: false,
			created: '2024-09-10T10:10:50'
		}
]
