declare namespace formatTypes{
    type dateFormat = `${string}-${string}-${string} ${string}:${string}:${string}`
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
        lat?: number ,
        lng?: number
    }

    type location = {
        city: string,
        street?: string,
        buildingNr?: string,
    }

    type flag ={ flag?: "fromMapClick"| "fromMarker"}
}

declare namespace middlewareTypes {
    type JwtPayload = {
        userId: number,
        userName?: string,
        userImage?: string,
        userEmail: string,
        userType: string,
        iat?: number,
        exp?: number
      };
}

declare namespace errorTypes {
    type errorMsg = {
        status: number,
        text: string
      };
}

type DynamicObject<T> = {
    [key: string]: T;
  };
