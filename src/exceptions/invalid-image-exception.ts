import { BAD_REQUEST } from 'http-status-codes'

import HttpException from './http-exception'

import {
    IMAGE_TYPE_PNG,
    IMAGE_TYPE_JPG,
    IMAGE_TYPE_JPEG,
    IMAGE_TYPE_GIF
} from '../constants'

export default class InvalidImageException extends HttpException {
    constructor(fieldName: string) {
        super(BAD_REQUEST,
            'Invalid Image Error',
            [{
                [fieldName]: `Invalid image type, valid types are: 
                    ${IMAGE_TYPE_PNG},
                    ${IMAGE_TYPE_JPG},
                    ${IMAGE_TYPE_JPEG},
                    ${IMAGE_TYPE_GIF}`
            }])
    }
}