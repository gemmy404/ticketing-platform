import {Module} from "@nestjs/common";
import {ContractsService} from "@app/contracts/contracts.service";

@Module({
    imports: [],
    providers: [
        ContractsService,
    ],
})
export class ContractsModule {
}