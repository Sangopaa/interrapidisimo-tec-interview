import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
    const apiBaseUrl = environment.apiBaseUrl;

    const newReq = req.clone({
        url: req.url.startsWith('http') ? req.url : `${apiBaseUrl}${req.url}`
    })

    return next(newReq)

}
