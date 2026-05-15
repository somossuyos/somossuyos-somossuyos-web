export type ScheduleConferenceData = {
	Nombres: string;
	Apellidos: string;
	Correo: string;
	Telefono: string;
	Charla_Parroquial: boolean;
	Evento_Privado: boolean;
	Grupo_Apostolado: boolean;
	Virtual: boolean;
	Organizador: Organizador;
	Resumen: string;
	Fecha_Definida: boolean;
}

export type Organizador = {
	Nombre: string;
	Pais: string;
	Direccion: string;
}
