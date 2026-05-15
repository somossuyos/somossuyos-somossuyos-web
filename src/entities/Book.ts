import { Media, MediaData } from './types/SharedTypes';

export interface Book  {
    id?:          number;
    url?:         string;
    Nombre?:      string;
    Autor?:       string;
    Descripcion?: string;
    createdAt?:   Date;
    updatedAt?:   Date;
    publishedAt?: Date;
    Precio?:      number;
    Link?:        string;
    En_venta?:    boolean;
    link_paypal?: string;
    Miniatura?:   MediaData<Media>;
}