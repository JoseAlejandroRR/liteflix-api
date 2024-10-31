import 'dotenv/config'
import 'reflect-metadata'
import 'tsconfig-paths/register'

import { handle, LambdaContext, LambdaEvent } from 'hono/aws-lambda'
import { AddressInfo } from 'net'
import httpServer from './infra/http/HTTPServer'
import { serve } from '@hono/node-server'
import HTTPGateway from './infra/http/HTTPGateway'
import ApplicationContext from './infra/ApplicationContext'
import { container } from 'tsyringe'
import IDatabase from './domain/database/IDatabase'
import { ServiceProviderIds } from './domain/ServiceProvideIds'
import { swaggerDoc } from './infra/http/swagger'
import { swaggerUI} from '@hono/swagger-ui'
import { Context } from 'hono'

const { NODE_ENV, PORT } = process.env

ApplicationContext.initialize()
  
const database:IDatabase = container.resolve(ServiceProviderIds.Database)
const gateway: HTTPGateway = container.resolve(HTTPGateway)

gateway.bindRoutes(httpServer)

httpServer.get('/swagger', swaggerUI({ url:'/docs' }))
httpServer.use('/docs', async (ctx: Context) => {
  return ctx.json(swaggerDoc)
})

if (PORT && NODE_ENV && NODE_ENV !== 'production') {
  serve({
      fetch: httpServer.fetch,
      port: Number(PORT),
    },
    async (info: AddressInfo) => {
      console.log(`Server at: http://${info.address}:${info.port}`)
      await database.startConnection()
    }
  )
}

export const handler = async (event:LambdaEvent, context: LambdaContext) => {
  await database.startConnection()
  return handle(httpServer)(event, context)
}