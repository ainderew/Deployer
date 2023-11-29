import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}



const trigger = {
  getBranches: async(sshCommand:string, projectDirectory:string ) => ipcRenderer.invoke('getBranches', [sshCommand,projectDirectory]),
  getAllEnvironments: async() =>ipcRenderer.invoke('getAllEnvironments'),
  saveEnvironment: async(environmentName:string, sshCommand:string, projectName:string, projectDirectory:string, processManagerName:string, databaseName?:string) =>ipcRenderer.invoke('saveEnvironment', [environmentName, sshCommand, projectName, projectDirectory, processManagerName, databaseName]),
  getRemoteUrl: async(sshCommand:string, projectDirectory:string) => ipcRenderer.invoke('getRemoteUrl', [sshCommand, projectDirectory]),
  openTerminal: async(sshCommand:string, projectDirectory:string) => ipcRenderer.invoke('openTerminal', [sshCommand, projectDirectory]),
  openRemoteRepo: async(remoteUrl:string) => ipcRenderer.invoke('openRemoteRepo', [remoteUrl]),
  restartProcess: async (sshCommand:string,projectDirectory:string,processManagerName:string) => ipcRenderer.invoke("restartProcess", [sshCommand,projectDirectory,processManagerName]),
  deployBranch: async (sshCommand:string,projectDirectory:string,branchName: string,processManagerName:string) => ipcRenderer.invoke("deployBranch", [sshCommand,projectDirectory,branchName,processManagerName]),
  getActiveBranch: async(sshCommand:string, projectDirectory:string) => ipcRenderer.invoke('getActiveBranch', [sshCommand, projectDirectory]),
  onUpdateTerminal: (callback) => ipcRenderer.addListener('updateTerminal', callback)
}


contextBridge.exposeInMainWorld('ipc', handler)
contextBridge.exposeInMainWorld('deployer', trigger)

export type IpcHandler = typeof handler
export type TriggerHandler = typeof trigger