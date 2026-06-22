import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TransactionController::customerMenu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
export const customerMenu = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customerMenu.url(args, options),
    method: 'get',
})

customerMenu.definition = {
    methods: ["get","head"],
    url: '/order/{table}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::customerMenu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
customerMenu.url = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { table: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    table: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        table: args.table,
                }

    return customerMenu.definition.url
            .replace('{table}', parsedArgs.table.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::customerMenu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
customerMenu.get = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customerMenu.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::customerMenu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
customerMenu.head = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: customerMenu.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::customerMenu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
    const customerMenuForm = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: customerMenu.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::customerMenu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
        customerMenuForm.get = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customerMenu.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::customerMenu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
        customerMenuForm.head = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customerMenu.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    customerMenu.form = customerMenuForm
/**
* @see \App\Http\Controllers\TransactionController::customerStoreOrder
 * @see app/Http/Controllers/TransactionController.php:665
 * @route '/order/{table}'
 */
export const customerStoreOrder = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: customerStoreOrder.url(args, options),
    method: 'post',
})

customerStoreOrder.definition = {
    methods: ["post"],
    url: '/order/{table}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::customerStoreOrder
 * @see app/Http/Controllers/TransactionController.php:665
 * @route '/order/{table}'
 */
customerStoreOrder.url = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { table: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    table: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        table: args.table,
                }

    return customerStoreOrder.definition.url
            .replace('{table}', parsedArgs.table.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::customerStoreOrder
 * @see app/Http/Controllers/TransactionController.php:665
 * @route '/order/{table}'
 */
customerStoreOrder.post = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: customerStoreOrder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::customerStoreOrder
 * @see app/Http/Controllers/TransactionController.php:665
 * @route '/order/{table}'
 */
    const customerStoreOrderForm = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: customerStoreOrder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::customerStoreOrder
 * @see app/Http/Controllers/TransactionController.php:665
 * @route '/order/{table}'
 */
        customerStoreOrderForm.post = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: customerStoreOrder.url(args, options),
            method: 'post',
        })
    
    customerStoreOrder.form = customerStoreOrderForm
/**
* @see \App\Http\Controllers\TransactionController::kitchen
 * @see app/Http/Controllers/TransactionController.php:767
 * @route '/kitchen'
 */
export const kitchen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kitchen.url(options),
    method: 'get',
})

kitchen.definition = {
    methods: ["get","head"],
    url: '/kitchen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::kitchen
 * @see app/Http/Controllers/TransactionController.php:767
 * @route '/kitchen'
 */
kitchen.url = (options?: RouteQueryOptions) => {
    return kitchen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::kitchen
 * @see app/Http/Controllers/TransactionController.php:767
 * @route '/kitchen'
 */
kitchen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kitchen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::kitchen
 * @see app/Http/Controllers/TransactionController.php:767
 * @route '/kitchen'
 */
kitchen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kitchen.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::kitchen
 * @see app/Http/Controllers/TransactionController.php:767
 * @route '/kitchen'
 */
    const kitchenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: kitchen.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::kitchen
 * @see app/Http/Controllers/TransactionController.php:767
 * @route '/kitchen'
 */
        kitchenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kitchen.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::kitchen
 * @see app/Http/Controllers/TransactionController.php:767
 * @route '/kitchen'
 */
        kitchenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kitchen.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    kitchen.form = kitchenForm
/**
* @see \App\Http\Controllers\TransactionController::updatePrepStatus
 * @see app/Http/Controllers/TransactionController.php:783
 * @route '/kitchen/order/{order}/status'
 */
export const updatePrepStatus = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePrepStatus.url(args, options),
    method: 'post',
})

updatePrepStatus.definition = {
    methods: ["post"],
    url: '/kitchen/order/{order}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::updatePrepStatus
 * @see app/Http/Controllers/TransactionController.php:783
 * @route '/kitchen/order/{order}/status'
 */
updatePrepStatus.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return updatePrepStatus.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::updatePrepStatus
 * @see app/Http/Controllers/TransactionController.php:783
 * @route '/kitchen/order/{order}/status'
 */
updatePrepStatus.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePrepStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::updatePrepStatus
 * @see app/Http/Controllers/TransactionController.php:783
 * @route '/kitchen/order/{order}/status'
 */
    const updatePrepStatusForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePrepStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::updatePrepStatus
 * @see app/Http/Controllers/TransactionController.php:783
 * @route '/kitchen/order/{order}/status'
 */
        updatePrepStatusForm.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePrepStatus.url(args, options),
            method: 'post',
        })
    
    updatePrepStatus.form = updatePrepStatusForm
/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/pos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/pos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/pos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/pos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/pos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/pos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/pos'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\TransactionController::kasir
 * @see app/Http/Controllers/TransactionController.php:45
 * @route '/kasir'
 */
export const kasir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kasir.url(options),
    method: 'get',
})

kasir.definition = {
    methods: ["get","head"],
    url: '/kasir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::kasir
 * @see app/Http/Controllers/TransactionController.php:45
 * @route '/kasir'
 */
kasir.url = (options?: RouteQueryOptions) => {
    return kasir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::kasir
 * @see app/Http/Controllers/TransactionController.php:45
 * @route '/kasir'
 */
kasir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kasir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::kasir
 * @see app/Http/Controllers/TransactionController.php:45
 * @route '/kasir'
 */
kasir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kasir.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::kasir
 * @see app/Http/Controllers/TransactionController.php:45
 * @route '/kasir'
 */
    const kasirForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: kasir.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::kasir
 * @see app/Http/Controllers/TransactionController.php:45
 * @route '/kasir'
 */
        kasirForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kasir.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::kasir
 * @see app/Http/Controllers/TransactionController.php:45
 * @route '/kasir'
 */
        kasirForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kasir.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    kasir.form = kasirForm
/**
* @see \App\Http\Controllers\TransactionController::history
 * @see app/Http/Controllers/TransactionController.php:611
 * @route '/transactions'
 */
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::history
 * @see app/Http/Controllers/TransactionController.php:611
 * @route '/transactions'
 */
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::history
 * @see app/Http/Controllers/TransactionController.php:611
 * @route '/transactions'
 */
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::history
 * @see app/Http/Controllers/TransactionController.php:611
 * @route '/transactions'
 */
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::history
 * @see app/Http/Controllers/TransactionController.php:611
 * @route '/transactions'
 */
    const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: history.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::history
 * @see app/Http/Controllers/TransactionController.php:611
 * @route '/transactions'
 */
        historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::history
 * @see app/Http/Controllers/TransactionController.php:611
 * @route '/transactions'
 */
        historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    history.form = historyForm
/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:70
 * @route '/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:70
 * @route '/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:70
 * @route '/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:70
 * @route '/checkout'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:70
 * @route '/checkout'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TransactionController::voidPending
 * @see app/Http/Controllers/TransactionController.php:313
 * @route '/checkout/void/{order}'
 */
export const voidPending = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: voidPending.url(args, options),
    method: 'post',
})

voidPending.definition = {
    methods: ["post"],
    url: '/checkout/void/{order}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::voidPending
 * @see app/Http/Controllers/TransactionController.php:313
 * @route '/checkout/void/{order}'
 */
voidPending.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return voidPending.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::voidPending
 * @see app/Http/Controllers/TransactionController.php:313
 * @route '/checkout/void/{order}'
 */
voidPending.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: voidPending.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::voidPending
 * @see app/Http/Controllers/TransactionController.php:313
 * @route '/checkout/void/{order}'
 */
    const voidPendingForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: voidPending.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::voidPending
 * @see app/Http/Controllers/TransactionController.php:313
 * @route '/checkout/void/{order}'
 */
        voidPendingForm.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: voidPending.url(args, options),
            method: 'post',
        })
    
    voidPending.form = voidPendingForm
/**
* @see \App\Http\Controllers\TransactionController::splitOrder
 * @see app/Http/Controllers/TransactionController.php:352
 * @route '/checkout/split/{order}'
 */
export const splitOrder = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: splitOrder.url(args, options),
    method: 'post',
})

splitOrder.definition = {
    methods: ["post"],
    url: '/checkout/split/{order}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::splitOrder
 * @see app/Http/Controllers/TransactionController.php:352
 * @route '/checkout/split/{order}'
 */
splitOrder.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return splitOrder.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::splitOrder
 * @see app/Http/Controllers/TransactionController.php:352
 * @route '/checkout/split/{order}'
 */
splitOrder.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: splitOrder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::splitOrder
 * @see app/Http/Controllers/TransactionController.php:352
 * @route '/checkout/split/{order}'
 */
    const splitOrderForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: splitOrder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::splitOrder
 * @see app/Http/Controllers/TransactionController.php:352
 * @route '/checkout/split/{order}'
 */
        splitOrderForm.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: splitOrder.url(args, options),
            method: 'post',
        })
    
    splitOrder.form = splitOrderForm
const TransactionController = { customerMenu, customerStoreOrder, kitchen, updatePrepStatus, index, kasir, history, store, voidPending, splitOrder }

export default TransactionController