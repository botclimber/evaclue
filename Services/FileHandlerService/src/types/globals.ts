declare namespace formatTypes{
    type dateFormat = `${string}-${string}-${string} ${string}:${string}:${string}`
    type postalCodeFormat = `${number}-${number}`
 }

 declare namespace allowedExtensions {
    type img = "jpg" | "png"
    type docProof = "pdf"
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

declare namespace middlewareTypes {
    type JwtPayload = {
        userId: number,
        userName?: string,
        userImage?: string,
        userEmail: string,
        userType: string
      };
}

declare namespace requestFormat{
    type addReviewImgs = {
        reviewId: number
    }

}
