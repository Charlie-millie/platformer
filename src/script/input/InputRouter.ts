
export class InputRouter<Receiver> {
    public receivers = new Set<Receiver>();

    public addReceiver(receiver: Receiver) {
        this.receivers.add(receiver);
    }

    public dropReceiver(receiver: Receiver) {
        this.receivers.delete(receiver);
    }

    public route(routeInput: (receiver: Receiver) => void) {
        for (const receiver of this.receivers) {
            routeInput(receiver);
        }
    }
}