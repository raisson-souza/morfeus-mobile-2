import { ZodError } from "zod"

export default function validatorErrorParser(error: ZodError): string {
    let errorMessage = ""
    error.issues.map(issue => {
        errorMessage += `${ issue.message }.\n`
    })
    return errorMessage
}