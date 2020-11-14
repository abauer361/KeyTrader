import{
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse
} from "@angular/common/http"
import{ catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./components/error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    intercept(req: HttpRequest<any>, next:HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                console.log("Error has occurred here");

                //default error message
                let errorMessage = "An unknown error has occurred"
                //if there is a message attached to this error
                if(error.error.message) {
                    errorMessage = error.error.message;
                }

                else if(error.message) {
                    errorMessage = error.message;
                }

                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
                return throwError(error);
            })
        );
    }
}
