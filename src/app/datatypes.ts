import { JsonFormData } from "./components/dynamic-form/dynamic-form.component";

export interface NavigateDetail {
    title?: string;
    route?: string;
    back?: boolean;
    tag?: string;
    icon?: string;
    //sidenav?: boolean;
}

export interface Staff {
    id?: string;
    names?: string;
    email?: string;
    pass?: string; // Asignado por 
    phone?: string;
}

export interface CotizaWish {
    _id?: string;
    consecutive?: string;
    // itemTagList?: ItemTag[];
    client_name?: string;
    client_contact?: string;
    client_contact_position?: string;
    client_contact_city?: string;
    client_phone?: string;
    client_email?: string;
    client_observations?: string;
    agent_id?: string; // El id del agente que lo está editando. Solo se agrega cuando status es mayor de 0
    agent_name?: string;
    agent_city?: string;
    agent_phone?: string;
    agent_email?: string;
    itemList: Item[];
    status: number; // -1:rechazado 0:en espera para salvar, 1:enviado al servidor salvado , 2:cotizado, 3:vista previa, 4:Enviado al cliente
    date?: number;
    htmlQuote?: string;
    p_iva: number; // Iva por defecto
    error: string; // Error de fecha por ejemplo. Si es mayor de 0
    condList?: string[];
    hideTotal?: boolean
    crome_image?: string;
    total?: number;
}

export interface ItemTag {
    expand: boolean;
    origen?: string;
    precio: number;
    descuento: number;
    p_increment?: number;
    p_iva: number;
    cantidad: number;
    notas?: string;
    date?: number;
}

export interface Item {
    familia: string
    itemTag?: ItemTag;
    // origen?: string // MARPICO OMV...
    descripcion_comercial: string
    descripcion_larga: string
    material: string
    empaque_individual: any
    empaque_unds_caja: number
    empaque_und_medida: any
    empaque_largo: string
    empaque_ancho: string
    empaque_alto: string
    empaque_peso_neto: string
    empaque_peso_bruto: string
    area_impresion: string
    medidas_largo: string
    medidas_ancho: string
    medidas_alto: string
    medidas_omv: string
    medidas_diametro: any
    medidas_peso_neto: string
    tecnica_marca_codigo: string
    tecnica_marca_tecnica: string
    tecnica_marca_precio: number
    tecnica_marca_num_tintas: any
    tecnica_marca_descripcion: string
    existencia: number
    precio: number
    subcategoria_1: Subcategoria
    subcategoria_2: Subcategoria
    subcategoria_3: Subcategoria
    temas: string[]
    etiquetas: Etiqueta[]
    etiqList: []
    imagenes: string[];
    materiales: Materiales[]
    imagen: string;
    tag?: any;
    lista_colores?: string;
}

export interface Subcategoria {
    jerarquia: string
    nombre: string
    categoria: Categoria
}

export interface Categoria {
    jerarquia: string
    nombre: string
}

export interface Materiales {
    codigo: string
    variedad: any
    color_nombre: string
    inventario_almacen: InventarioAlmacen[]
    trackings_importacion: TrackingsImportacion[]
    precio: string
    descuento: string
    estado: string
    inventario: number
    imagenes: string[]
}

export interface InventarioAlmacen {
    almacen: Almacen
    cantidad: number
    unidad: string
}

export interface Almacen {
    centro: Centro
    codigo: number
    nombre: string
}

export interface Centro {
    codigo: number
    nombre: string
}

export interface TrackingsImportacion {
    id: number
    estado: string
    fecha: string
    cantidad: number
    unidad: string
    ultima_actualizacion: string
    material_id: number
}

/*
export interface Imagen {
    file: string
    file_sm: string
    file_md: string
}

export interface Imagenes {
    id: number;
    imagen: Imagen;
    orden?: number;
    nombre_original?: string;
}
*/

export interface Etiqueta {
    id: 30;
    nombre: string;
}