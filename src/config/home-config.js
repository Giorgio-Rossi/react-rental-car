export const getTableAdminConfig = () => ({
  headers: [
    { key: 'id', columnName: 'Codice richiesta', type: 'Number', ordinable: true, filtrable: true },
    { key: 'carDetails', columnName: 'Targa auto', type: 'String', ordinable: true, filtrable: true },
    { key: 'userFullName', columnName: 'Cliente', type: 'String', ordinable: true, filtrable: true },
    { key: 'status', columnName: 'Stato prenotazione', type: 'String', ordinable: false, filtrable: true }
  ],
  currentByDefault: { key: 'id', orderby: 'asc' },
  pagination: { itemsPerPage: 10, currentPage: 1 },
  actions: {
    actions: [
      {
        name: 'Modifica',
        visible: (row) => true
      },
      {
        name: 'Cancella',
        visible: (row) => true
      }
    ]
  }
});


export const getTableCustomerConfig = () => ({
  headers: [
    { key: 'id', columnName: 'Codice richiesta', type: 'Number', ordinable: true, filtrable: true },
    { key: 'carDetails', columnName: 'Macchina', type: 'String', ordinable: false, filtrable: true },
    { key: 'status', columnName: 'Stato prenotazione', type: 'String', ordinable: true, filtrable: true },
    { key: 'startReservation', columnName: 'Data inizio prenotazione', type: 'Date', ordinable: true, filtrable: true },
    { key: 'endReservation', columnName: 'Data fine prenotazione', type: 'Date', ordinable: false, filtrable: true }
  ],
  currentByDefault: { key: 'id', orderby: 'asc' },
  pagination: { itemsPerPage: 10, currentPage: 1 },
  actions: {
    actions: [
      { name: 'Modifica', visible: () => true },
      { name: 'Cancella', visible: () => true }
    ]
  }
});

export function getButtonConfigsAdmin() {
  return [
    { label: 'Home', path: '/home' },
    { label: 'Gestisci richieste', path: '/manage-requests' },
    { label: 'Gestisci auto', path: '/manage-cars' },
    { label: 'Aggiungi auto', path: '/add-car' },
    { label: 'Gestisci utenti', path: '/manage-users' },
    { label: 'Aggiungi utente', path: '/add-user' }
  ];
}

export function getButtonConfigsUser() {
  return [
    { label: 'Home', path: '/home' },
    { label: 'Aggiungi richieste di prenotazione', path: '/new-request' },
  ];
}
