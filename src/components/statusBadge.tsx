import { SyncStatus } from "@/types/field-logs";
import { Text } from "react-native";

const CONFIG: Record<SyncStatus, { label:string, color:string}> ={
    pending: {
        label: 'Pending',
        color: 'orange'
    },
    syncing: {
        label: 'Syncing',
        color: 'blue'
    },
    failed: {
        label: 'Failed',
        color: 'red'
    },
    synced: {
        label: 'Synced',
        color: 'green'
    }
}

export function StatusBadge({status}:{status: SyncStatus}) {
    const config = CONFIG[status]
    return <Text style={{ color: config.color, fontWeight: "600" }}>{config.label}</Text>
}