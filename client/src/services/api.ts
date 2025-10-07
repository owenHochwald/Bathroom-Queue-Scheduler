import { dataTagErrorSymbol, useQuery } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { HistoryItem, QueueStatus } from '../types/types'
import { client } from './client'

export const joinQueue = async (userId: string, isEmergency: boolean): Promise<AxiosResponse<any, any>> => {
    return await client.post('/join', {
        data: {
            user_id: userId,
            is_emergency: isEmergency
        }
    })
}

export const leaveQueue = async (userId: string): Promise<AxiosResponse<any, any>> => {
    return await client.delete('/leave', {
        data: {
            user_id: userId
        }
    });
}

export const getQueueStatus = async (): Promise<AxiosResponse<QueueStatus>> => {
    return await client.get<QueueStatus>('/queue/status');
}


export const getUserStats = async (userId: string): Promise<AxiosResponse<any, any>> => {
    return await client.get("/status/" + userId)


}

export const getHistory = async (): Promise<AxiosResponse<HistoryItem[], any>> => {
    return await client.get<HistoryItem[]>('/history')
}