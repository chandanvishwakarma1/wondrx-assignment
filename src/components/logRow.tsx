import { FieldLog } from '@/types/field-logs';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBadge } from './statusBadge';

export const ROW_HEIGHT = 76;
function LogRowBase({ log, onRetry }: { log: FieldLog, onRetry: (id:string) => void }) {
    return (<View style={style.row}>
        <View style={{flex: 1, marginRight: 11, justifyContent:'center'}}>
            <Text style={{ fontWeight: "600" }} numberOfLines={1}>{log.customerName}</Text>
            <Text style={{ color: 'gray' }} numberOfLines={1} ellipsizeMode='tail'>{log.notes}</Text>
        </View>
        {log.status === 'failed' && (<Pressable onPress={()=>onRetry(log.id)}> <Text>Retry</Text></Pressable>)}
        <StatusBadge status={log.status} />
    </View>)
}

export const LogRow = React.memo(LogRowBase)

const style = StyleSheet.create({
    row: { height: ROW_HEIGHT, padding: 24, flexDirection: 'row', gap:4 }
})