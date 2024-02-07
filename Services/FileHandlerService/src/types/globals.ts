declare namespace requestFormat{
    type revFiles = {
        reviewId: number
    }

    type resFiles = {
        resId: number
    }

    type ticketFiles = {
        ticketId: number
    }

    type profileFiles = {
        userId: number
    }

    type genericResponse = {
        status: number, 
        msg: string,
        newFileName?: string
    }
}