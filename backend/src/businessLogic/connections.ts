import { ConnectionsAccess } from '../dataLayer/connectionsAccess'
import { ConnectionItem } from '../models/ConnectionItem'

const connectionsAccess = new ConnectionsAccess()

export async function getConnectionsForUserId(userId: string): Promise<ConnectionItem[]> {
  return connectionsAccess.getConnectionsForUserId(userId)
}

export async function createConnection(
  connectionItem: ConnectionItem
): Promise<ConnectionItem> {

  return await connectionsAccess.createConnection(connectionItem)
}

export async function deleteConnection(id: string): Promise<void> {
  await connectionsAccess.deleteConnection(id)
}
