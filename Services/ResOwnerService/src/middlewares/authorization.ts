export const isAuthz = (uType: string) => {
    const cols = ["col", "admin", "superAdmin"]

    return cols.includes(uType)
} 