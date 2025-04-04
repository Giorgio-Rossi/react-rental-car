import { useCarRequest } from "../hooks/useCarRequest";

export const getTableAdminConfig = () => ({
  headers: [
    { key: 'id', columnName: 'Codice richiesta', type: 'Number', ordinable: true, filtrable: true },
    { key: 'carDetails', columnName: 'Targa auto', type: 'String', ordinable: true, filtrable: true },
    { key: 'fullName', columnName: 'Cliente', type: 'String', ordinable: true, filtrable: true },
    { key: 'status', columnName: 'Stato prenotazione', type: 'Date', ordinable: false, filtrable: true }
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


export const getTableCustomerConfig = (canEditRequest) => ({
  headers: [
    { key: 'id', columnName: 'Codice richiesta', type: 'Number', ordinable: true, filtrable: true },
    { key: 'carDetails', columnName: 'Macchina', type: 'String', ordinable: false, filtrable: true },
    { key: 'status', columnName: 'Stato prenotazione', type: 'String', ordinable: true, filtrable: true },
    { key: 'start_reservation', columnName: 'Data inizio prenotazione', type: 'Date', ordinable: true, filtrable: true },
    { key: 'end_reservation', columnName: 'Data fine prenotazione', type: 'Date', ordinable: false, filtrable: true }
  ],
  currentByDefault: { key: 'id', orderby: 'asc' },
  pagination: { itemsPerPage: 10, currentPage: 1 },
  actions: {
    actions: [
      { name: 'Modifica', visible: (row) => canEditRequest(row) },
      { name: 'Cancella', visible: () => true }
    ]
  }
});


export function getButtonConfigsAdmin(router) {
  return [
    { label: 'Home', action: () => router.navigate(['/home']) },
    { label: 'Gestisci richieste', action: () => router.navigate(['/manage-requests']) },
    { label: 'Gestisci auto', action: () => router.navigate(['/manage-cars']) },
    { label: 'Aggiungi auto', action: () => router.navigate(['/add-car']) },
    { label: 'Gestisci utenti', action: () => router.navigate(['/manage-users']) },
    { label: 'Aggiungi utente', action: () => router.navigate(['/add-user']) }
  ];
}

export function getButtonConfigsUser(router) {
  return [
    { label: 'Home', action: () => router.navigate(['/home']) },
    { label: 'Aggiungi richieste di prenotazione', action: () => router.navigate(['/new-request']) },
  ];
}

