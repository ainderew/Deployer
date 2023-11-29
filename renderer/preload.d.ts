import { ActiveBranchHandler, DeployHandler, IpcHandler, TriggerHandler } from '../main/preload'

declare global {
  interface Window {
    ipc: IpcHandler,
    deployer: TriggerHandler,
  }
}
