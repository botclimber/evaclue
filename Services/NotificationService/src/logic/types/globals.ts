declare namespace formatTypes{
    type dateFormat = `${number}-${number}-${number} ${number}:${number}:${number}`
    type postalCodeFormat = `${number}-${number}`
}

declare namespace DbParams{

    type updateParams = {
        table: string,
        id: number,
        columns: string[],
        values: any[]
    }
}

declare namespace locationFormats{
    type latLng = {
        lat: number | undefined,
        lng: number | undefined
    }

    type location = {
        city: string,
        street?: string,
        buildingNr?: string,
    }
}
