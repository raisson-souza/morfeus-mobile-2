import { ZodError } from "zod"

export default function validatorErrorParser(error: ZodError): string {
    let errorMessage = ""
    error.issues.map(issue => {
        if (issue.message === "Obrigatório")
            errorMessage += `Campo ${ issue.path[0] } é obrigatório.\n`
        else
            errorMessage += `${ issue.message }.\n`
    })
    return errorMessage
}