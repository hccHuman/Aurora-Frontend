/**
 * M.A.R.I.A Context Model
 * 
 * Defines the structure of the data captured from the browser environment 
 * to provide situational awareness to the Aurora AI.
 */

export interface MariaContext {
    url: string;
    path: string;
    title: string;
    language: string;
    timestamp: string;
}
