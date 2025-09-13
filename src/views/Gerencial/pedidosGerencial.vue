<template>
  <v-container fluid class="pa-3 bg-grey-lighten-5 kanban-root">
    <!-- ===== Topbar / Actions ===== -->
    <div class="d-flex align-center mb-3 topbar">
      <div class="d-flex align-center">
        <v-icon class="mr-2" size="24">mdi-view-kanban</v-icon>
        <h2 class="text-h5 font-weight-bold mr-4">Kanban de Pedidos</h2>
      </div>

      <v-btn size="small" variant="elevated" class="mr-2" color="primary" :loading="loading" @click="fetchPedidos" :ripple="false">
        <v-icon start>mdi-refresh</v-icon> Atualizar
      </v-btn>

      <v-menu v-model="menuAutoRefresh" :close-on-content-click="false" offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" size="small" variant="text" class="mr-2" :ripple="false">
            <v-icon start>mdi-timer-sand</v-icon>
            Auto {{ autoPollEnabled ? 'ON' : 'OFF' }}
          </v-btn>
        </template>
        <v-card min-width="260">
          <v-list density="compact">
            <v-list-item>
              <template #prepend><v-icon>mdi-clock-outline</v-icon></template>
              <v-list-item-title>Atualização automática</v-list-item-title>
              <template #append>
                <v-switch inset v-model="autoPollEnabled" color="primary" hide-details density="compact"></v-switch>
              </template>
            </v-list-item>
            <v-list-item>
              <v-slider v-model="pollMsUi" :min="4000" :max="30000" step="1000" hide-details thumb-label class="px-2"></v-slider>
            </v-list-item>
            <v-list-item subtitle="Intervalo (segundos)">
              <div class="text-subtitle-2">{{ (pollMsUi/1000).toFixed(0) }}s</div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <v-chip size="small" class="mr-2" color="grey-lighten-2" variant="flat">
        <v-icon start>mdi-format-list-numbered</v-icon> Total: {{ allPedidos.length }}
      </v-chip>

      <v-chip
        size="small"
        class="mr-2"
        :color="hasErrors ? 'red-lighten-3' : 'green-lighten-3'"
        variant="flat"
        v-if="syncBadgeVisible"
      >
        <v-icon start>{{ hasErrors ? 'mdi-alert' : 'mdi-check' }}</v-icon>
        {{ hasErrors ? 'Atenção' : 'OK' }}
      </v-chip>

      <v-spacer />

      <!-- Filtros rápidos -->
      <div class="d-none d-md-flex mr-2">
        <v-btn-toggle v-model="quickFilter" density="comfortable" variant="outlined" divided>
          <v-btn value="all" :ripple="false"><v-icon start>mdi-filter</v-icon> Todos</v-btn>
          <v-btn value="today" :ripple="false"><v-icon start>mdi-calendar-today</v-icon> Hoje</v-btn>
          <v-btn value="gt500" :ripple="false"><v-icon start>mdi-cash</v-icon> &gt; R$ 500</v-btn>
          <v-btn value="late" :ripple="false"><v-icon start>mdi-alert-decagram</v-icon> +48h</v-btn>
        </v-btn-toggle>
      </div>

      <v-text-field
        v-model="buscaTexto"
        density="comfortable"
        hide-details
        placeholder="Buscar por ID, cliente, produto..."
        prepend-inner-icon="mdi-magnify"
        class="kanban-search"
        style="max-width: 360px"
        clearable
      />

      <v-tooltip text="Exportar CSV (visível)" location="bottom">
        <template #activator="{ props }">
          <v-btn icon variant="text" v-bind="props" class="ml-2" @click="exportCsv" :ripple="false">
            <v-icon>mdi-file-delimited</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>

    <!-- Mensagem de erro global -->
    <v-alert v-if="errorMsg" type="error" class="mb-2" variant="tonal" border="start">
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-alert</v-icon>
        <div class="flex-grow-1">{{ errorMsg }}</div>
        <v-btn size="x-small" variant="text" @click="errorMsg = ''">Fechar</v-btn>
      </div>
    </v-alert>

    <!-- ===== Lanes (scroll horizontal) ===== -->
    <v-row class="kanban-row flex-nowrap" no-gutters>
      <v-col v-for="col in columns" :key="col.key" class="pa-2 kanban-col">
        <div class="kanban-column elevation-1">
          <!-- Header da coluna -->
          <div class="kanban-column__header">
            <div class="d-flex align-center">
              <span class="text-caption text-grey-darken-1">{{ col.icon }}</span>
              <span class="text-subtitle-2 font-weight-bold ml-2">{{ col.label }}</span>
              <v-tooltip :text="`Pedidos em ${col.label}`" location="bottom">
                <template #activator="{ props }">
                  <v-chip v-bind="props" size="x-small" class="ml-2" color="grey-lighten-4" variant="flat">
                    {{ (lists[col.key] || []).length }}
                  </v-chip>
                </template>
              </v-tooltip>
            </div>

            <div class="d-flex align-center">
              <v-btn icon size="x-small" variant="text" :ripple="false" @click="sortLane(col.key, 'value')">
                <v-icon>mdi-sort-descending</v-icon>
              </v-btn>
              <v-btn icon size="x-small" variant="text" :ripple="false" @click="sortLane(col.key, 'date')">
                <v-icon>mdi-calendar</v-icon>
              </v-btn>
              <v-btn icon size="x-small" variant="text" :ripple="false" @click="collapse[col.key] = !collapse[col.key]">
                <v-icon>{{ collapse[col.key] ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Skeleton quando vazio + loading -->
          <template v-if="loading && (lists[col.key] || []).length === 0">
            <div class="pa-3">
              <v-skeleton-loader type="list-item-two-line, list-item-two-line, list-item-two-line" />
            </div>
          </template>

          <!-- Área de drop / lista -->
          <transition name="fade">
            <div v-show="!collapse[col.key]" class="kanban-dropzone-wrapper">
              <draggable
                v-model="lists[col.key]"
                :group="{ name: 'pedidos', put: true, pull: true }"
                item-key="_id"
                class="kanban-dropzone"
                :animation="180"
                handle=".drag-handle"
                ghost-class="drag-ghost"
                chosen-class="drag-chosen"
                drag-class="drag-active"
                @end="onDropEnd(col.key)"
              >
                <template #item="{ element }">
                  <v-card
                    class="kanban-card"
                    :class="cardClasses(element)"
                    variant="elevated"
                    :ripple="false"
                    :data-id="element._id"
                  >
                    <div class="d-flex align-start">
                      <v-btn icon size="x-small" variant="text" class="drag-handle mr-1" :ripple="false">
                        <v-icon size="16">mdi-drag</v-icon>
                      </v-btn>

                      <div class="flex-grow-1">
                        <div class="d-flex align-center">
                          <v-tooltip :text="element._id" location="bottom">
                            <template #activator="{ props }">
                              <span v-bind="props" class="text-caption text-grey-darken-1">#{{ element._id.slice(-6) }}</span>
                            </template>
                          </v-tooltip>

                          <v-spacer />

                          <v-chip size="x-small" :color="chipColor(element.status)" class="text-white" label>
                            {{ prettyStatus(element.status) }}
                          </v-chip>
                        </div>

                        <div class="text-body-2 mt-1 d-flex align-center">
                          <v-avatar size="20" class="mr-2" v-if="element.usuario?.nome">
                            <v-icon size="18">mdi-account</v-icon>
                          </v-avatar>
                          <strong class="truncate-1">{{ element.usuario?.nome || '—' }}</strong>
                        </div>

                        <div class="d-flex text-caption mt-1">
                          <span class="text-grey">Itens: {{ element.itens?.length || 0 }}</span>
                          <v-spacer />
                          <span class="font-weight-medium">{{ formatCurrency(element.valorTotal || 0) }}</span>
                        </div>

                        <div class="text-caption text-grey mt-1 d-flex align-center">
                          <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                          {{ formatDate(element.createdAt) }}
                        </div>

                        <div class="d-flex mt-2">
                          <v-img
                            v-for="img in previewImages(element)"
                            :key="img"
                            :src="img"
                            width="36"
                            height="36"
                            class="mr-1 border thumb"
                            cover
                          />
                        </div>

                        <!-- Barra de idade / SLA -->
                        <v-progress-linear
                          :model-value="agePercent(element.createdAt)"
                          height="5"
                          :color="ageColor(element.createdAt)"
                          class="mt-2 rounded-0"
                        ></v-progress-linear>
                      </div>
                    </div>

                    <!-- Footer ações -->
                    <div class="kanban-card__footer">
                      <v-tooltip text="Ver detalhes" location="bottom">
                        <template #activator="{ props }">
                          <v-btn v-bind="props" size="x-small" variant="tonal" @click.stop="abrirDetalhes(element)" :ripple="false">
                            <v-icon start size="16">mdi-card-text-outline</v-icon> Detalhes
                          </v-btn>
                        </template>
                      </v-tooltip>

                      <v-spacer />

                      <!-- Ações por status -->
                      <template v-if="isPago(element.status)">
                        <v-tooltip text="Enviar para Separação" location="bottom">
                          <template #activator="{ props }">
                            <v-btn
                              v-bind="props"
                              size="x-small"
                              variant="outlined"
                              :loading="busyId === element._id"
                              @click.stop="atualizarStatus(element, 'em_separacao')"
                              :ripple="false"
                            >
                              <v-icon start size="16">mdi-cart-arrow-down</v-icon>
                              Separação
                            </v-btn>
                          </template>
                        </v-tooltip>
                      </template>

                      <template v-else-if="isEmSeparacao(element.status)">
                        <v-btn
                          size="x-small"
                          variant="text"
                          :loading="busyId === element._id"
                          @click.stop="atualizarStatus(element, 'pago')"
                          :ripple="false"
                        >
                          <v-icon start size="16">mdi-undo</v-icon> Voltar
                        </v-btn>

                        <v-btn
                          size="x-small"
                          variant="outlined"
                          :loading="busyId === element._id"
                          @click.stop="atualizarStatus(element, 'expedicao')"
                          :ripple="false"
                        >
                          <v-icon start size="16">mdi-truck-fast</v-icon> Expedição
                        </v-btn>
                      </template>

                      <template v-else-if="isExpedicao(element.status)">
                        <v-btn
                          size="x-small"
                          variant="elevated"
                          color="primary"
                          @click.stop="openShipDialog(element)"
                          :ripple="false"
                        >
                          <v-icon start size="16">mdi-barcode</v-icon> Frete
                        </v-btn>

                        <v-btn size="x-small" variant="outlined" @click.stop="rastrearPedido(element)" :ripple="false">
                          <v-icon start size="16">mdi-crosshairs-gps</v-icon> Rastrear
                        </v-btn>

                        <v-btn
                          size="x-small"
                          variant="text"
                          :loading="busyId === element._id"
                          @click.stop="atualizarStatus(element, 'em_separacao')"
                          :ripple="false"
                        >
                          <v-icon start size="16">mdi-undo</v-icon> Voltar
                        </v-btn>
                      </template>

                      <template v-else-if="normalize(element.status) === 'finalizado'">
                        <v-btn
                          size="x-small"
                          variant="outlined"
                          :loading="busyId === element._id"
                          @click.stop="atualizarStatus(element, 'expedicao')"
                          :ripple="false"
                        >
                          <v-icon start size="16">mdi-truck-delivery</v-icon> Expedição
                        </v-btn>
                      </template>
                    </div>
                  </v-card>
                </template>

                <template #footer>
                  <div class="kanban-empty" v-if="(lists[col.key] || []).length === 0">
                    <v-icon size="18" class="mr-1">mdi-inbox</v-icon> Sem pedidos
                  </div>
                </template>
              </draggable>
            </div>
          </transition>
        </div>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.visible" :timeout="3500" :color="snackbar.color" top right>
      <v-icon start>{{ snackbar.color === 'red' ? 'mdi-alert' : 'mdi-check-circle' }}</v-icon>
      {{ snackbar.message }}
    </v-snackbar>

    <!-- ===== Dialog Detalhes ===== -->
    <v-dialog v-model="dialog.visible" max-width="980">
      <v-card class="rounded-0">
        <v-toolbar flat class="rounded-0" color="grey-lighten-4">
          <v-toolbar-title class="text-subtitle-1 font-weight-bold">
            Pedido #{{ dialog.pedido?._id }}
          </v-toolbar-title>
          <v-spacer />
          <v-chip size="small" :color="chipColor(dialog.pedido?.status)" class="text-white" label>
            {{ prettyStatus(dialog.pedido?.status) }}
          </v-chip>
          <v-btn icon @click="dialog.visible = false" variant="text" class="ml-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-4">
          <v-row dense>
            <v-col cols="12" md="4">
              <div class="text-subtitle-2 font-weight-bold mb-1">Cliente</div>
              <div class="text-body-2">
                <strong>{{ dialog.pedido?.usuario?.nome || '—' }}</strong><br>
                <span class="text-caption">{{ dialog.pedido?.usuario?.email }}</span><br>
                <span class="text-caption">{{ dialog.pedido?.usuario?.telefone }}</span>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="text-subtitle-2 font-weight-bold mb-1">Endereço de Entrega</div>
              <div class="text-body-2">
                {{ dialog.pedido?.enderecoEntrega?.rua }}, {{ dialog.pedido?.enderecoEntrega?.numero }}
                <span v-if="dialog.pedido?.enderecoEntrega?.complemento">
                  - {{ dialog.pedido?.enderecoEntrega?.complemento }}
                </span><br>
                {{ dialog.pedido?.enderecoEntrega?.bairro }} - {{ dialog.pedido?.enderecoEntrega?.cidade }}/{{ dialog.pedido?.enderecoEntrega?.estado }}<br>
                CEP: {{ dialog.pedido?.enderecoEntrega?.cep }}
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="text-subtitle-2 font-weight-bold mb-1">Frete</div>
              <div class="text-body-2">
                <strong>{{ dialog.pedido?.frete?.carrier || '—' }}</strong>
                <span class="text-caption"> ({{ dialog.pedido?.frete?.service || '—' }})</span><br>
                Prazo: {{ dialog.pedido?.frete?.prazo ?? '--' }} dia(s)<br>
                Valor frete: {{ formatCurrency(dialog.pedido?.frete?.valor || 0) }}<br>
                <template v-if="dialog.pedido?.frete?.trackingCode || dialog.pedido?.frete?.etiquetaUrl">
                  <v-divider class="my-2" />
                  <div class="text-caption">
                    Código: <strong>{{ dialog.pedido?.frete?.trackingCode || '—' }}</strong><br>
                    <a v-if="dialog.pedido?.frete?.trackingUrl" :href="dialog.pedido.frete.trackingUrl" target="_blank">Rastrear</a>
                    <a v-else-if="dialog.pedido?.frete?.etiquetaUrl" :href="dialog.pedido.frete.etiquetaUrl" target="_blank">Etiqueta</a>
                  </div>
                </template>
              </div>
            </v-col>
          </v-row>

          <v-row class="mt-2" dense>
            <v-col cols="12" md="4">
              <div class="text-caption text-grey">Criado em</div>
              <div class="text-body-2">{{ formatDate(dialog.pedido?.createdAt) }}</div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-grey">Total Produtos</div>
              <div class="text-body-2">{{ formatCurrency(dialog.pedido?.totalProdutos || 0) }}</div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-grey">Total do Pedido</div>
              <div class="text-body-2"><strong>{{ formatCurrency(dialog.pedido?.valorTotal || 0) }}</strong></div>
            </v-col>
          </v-row>

          <div class="mt-4" />
          <div class="text-subtitle-2 font-weight-bold mb-2">Itens</div>

          <v-table density="compact" class="border">
            <thead>
              <tr>
                <th style="width:64px">Img</th>
                <th>Produto</th>
                <th style="width:110px">Var.</th>
                <th style="width:90px" class="text-right">Qtde</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, i) in (dialog.pedido?.itens || [])" :key="i">
                <td>
                  <v-img :src="(it.produto?.imagensProdutos || [])[0]" width="48" height="48" class="border" cover />
                </td>
                <td>
                  <div class="text-body-2">
                    <strong>{{ it.produto?.marcaProduto }} {{ it.produto?.descricaoProduto }}</strong><br>
                    <span class="text-caption">{{ formatCurrency(it.valorUnitario || 0) }}</span>
                  </div>
                </td>
                <td class="text-caption">T: {{ it.tamanho }}<br/>C: {{ it.cor }}</td>
                <td class="text-right">{{ it.quantidade }}</td>
              </tr>
            </tbody>
          </v-table>

          <div class="d-flex justify-end gap-2 mt-4">
            <v-btn
              size="small"
              variant="outlined"
              :loading="busyId === dialog.pedido?._id"
              @click="acaoStatusDialog('em_separacao')"
              v-if="dialog.pedido && isPago(dialog.pedido.status)"
            >
              Ir p/ Separação
            </v-btn>

            <v-btn
              size="small"
              variant="outlined"
              :loading="busyId === dialog.pedido?._id"
              @click="acaoStatusDialog('expedicao')"
              v-if="dialog.pedido && isEmSeparacao(dialog.pedido.status)"
            >
              Enviar p/ Expedição
            </v-btn>

            <template v-if="dialog.pedido && isExpedicao(dialog.pedido.status)">
              <v-btn size="small" variant="outlined" color="primary" @click="openShipDialog(dialog.pedido)">
                Emitir Frete
              </v-btn>
              <v-btn size="small" variant="outlined" @click="rastrearPedido(dialog.pedido)">
                Rastrear
              </v-btn>
            </template>

            <v-btn
              size="small"
              variant="outlined"
              :loading="busyId === dialog.pedido?._id"
              @click="acaoStatusDialog('finalizado')"
              v-if="dialog.pedido && dialog.pedido.status === 'expedicao'"
            >
              Finalizar
            </v-btn>

            <v-btn
              size="small"
              variant="outlined"
              :loading="busyId === dialog.pedido?._id"
              @click="acaoStatusDialog('expedicao')"
              v-if="dialog.pedido && normalize(dialog.pedido.status) === 'finalizado'"
            >
              Voltar p/ Expedição
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- ===== Dialog Emitir Frete ===== -->
    <v-dialog v-model="dialogShip.visible" max-width="980">
  <v-card>
    <v-toolbar flat color="grey-lighten-4">
      <v-toolbar-title class="text-subtitle-1 font-weight-bold">
        Emitir Frete — Pedido #{{ dialogShip.pedido?._id }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon variant="text" @click="dialogShip.visible = false"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>

    <v-card-text>
      <v-alert v-if="dialogShip.error" type="error" variant="tonal" class="mb-3">
        {{ dialogShip.error }}
      </v-alert>

      <v-form v-model="dialogShip.valid" ref="formShipRef">
        <v-row>
          <!-- Remetente -->
          <v-col cols="12" md="6">
            <h3 class="mb-2">Remetente</h3>
            <v-text-field v-model="shipForm.from.name" label="Nome" required />
            <v-text-field v-model="shipForm.from.address" label="Endereço" required />
            <v-text-field v-model="shipForm.from.number" label="Número" required />
            <v-text-field v-model="shipForm.from.complement" label="Complemento" />
            <v-text-field v-model="shipForm.from.district" label="Bairro" required />
            <v-text-field v-model="shipForm.from.city" label="Cidade" required />
            <v-text-field v-model="shipForm.from.state_abbr" label="Estado" required />
            <v-text-field
              v-model="shipForm.from.postal_code"
              label="CEP"
              hint="Aceita 09351-080 ou 09351080 — enviaremos apenas dígitos"
              persistent-hint
              required
            />
            <v-text-field v-model="shipForm.from.email" label="Email" />
            <v-text-field v-model="shipForm.from.document" label="CPF/CNPJ" />
            <v-text-field v-model="shipForm.from.phone" label="Telefone" />
          </v-col>

          <!-- Destinatário -->
          <v-col cols="12" md="6">
            <h3 class="mb-2">Destinatário</h3>
            <v-text-field v-model="shipForm.to.name" label="Nome" required />
            <v-text-field v-model="shipForm.to.address" label="Endereço" required />
            <v-text-field v-model="shipForm.to.number" label="Número" required />
            <v-text-field v-model="shipForm.to.complement" label="Complemento" />
            <v-text-field v-model="shipForm.to.district" label="Bairro" required />
            <v-text-field v-model="shipForm.to.city" label="Cidade" required />
            <v-text-field v-model="shipForm.to.state_abbr" label="Estado" required />
            <v-text-field
              v-model="shipForm.to.postal_code"
              label="CEP"
              hint="Aceita 09531-110 ou 09531110 — enviaremos apenas dígitos"
              persistent-hint
              required
            />
            <v-text-field v-model="shipForm.to.email" label="Email" />
            <v-text-field
              v-model="shipForm.to.document"
              label="CPF/CNPJ"
              hint="Se deixar em branco, usaremos um CPF padrão para emissão"
              persistent-hint
              required
            />
            <v-text-field
              v-model="shipForm.to.phone"
              label="Telefone"
              hint="Somente dígitos serão enviados"
              persistent-hint
              required
            />
          </v-col>
        </v-row>

        <v-divider class="my-4" />
        <h3 class="mb-2">Volumes</h3>
        <v-row v-for="(vol, i) in shipForm.volumes" :key="i" class="mb-1">
          <v-col cols="6" sm="3">
            <v-text-field v-model.number="vol.height" type="number" min="1" label="Altura (cm)" required />
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field v-model.number="vol.width" type="number" min="1" label="Largura (cm)" required />
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field v-model.number="vol.length" type="number" min="1" label="Comprimento (cm)" required />
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field v-model.number="vol.weight" type="number" step="0.01" min="0.01" label="Peso (kg)" required />
          </v-col>
        </v-row>
        <div class="d-flex ga-2 mb-2">
          <v-btn size="small" @click="duplicarPrimeiroVolume">Duplicar 1º volume</v-btn>
          <v-btn size="small" color="error" @click="shipForm.volumes = []">Limpar volumes</v-btn>
        </div>

        <v-divider class="my-4" />
        <v-select
          v-model="shipForm.service"
          :items="servicosDisponiveis"
          item-title="title"
          item-value="value"
          label="Selecione o Serviço"
          hint="Ex.: 1 = PAC, 2 = SEDEX, 17 = Mini Envios"
          persistent-hint
          required
        />

        <v-divider class="my-4" />
        <div class="d-flex align-center justify-space-between">
          <h3 class="mb-2">Produtos</h3>
          <v-btn size="small" color="success" @click="shipForm.products.push({name:'',quantity:1,unitary_value:0})">
            Adicionar Produto
          </v-btn>
        </div>
        <v-row v-for="(p, i) in shipForm.products" :key="i" class="mb-2">
          <v-col cols="12" sm="5"><v-text-field v-model="p.name" label="Nome" required /></v-col>
          <v-col cols="12" sm="3"><v-text-field v-model.number="p.quantity" type="number" min="1" label="Quantidade" required /></v-col>
          <v-col cols="12" sm="3"><v-text-field v-model.number="p.unitary_value" type="number" min="0" label="Valor Unitário" required /></v-col>
          <v-col cols="12" sm="1" class="d-flex align-center">
            <v-btn icon color="error" @click="shipForm.products.splice(i,1)"><v-icon>mdi-delete</v-icon></v-btn>
          </v-col>
        </v-row>
        <v-alert type="info" v-if="!shipForm.products.length" variant="tonal" class="mb-2">
          Adicione ao menos 1 produto.
        </v-alert>

        <v-divider class="my-4" />
        <h3 class="mb-2">Opções</h3>
        <v-row>
          <v-col cols="12" sm="3"><v-checkbox v-model="shipForm.options.own_hand" label="Entrega em mãos" /></v-col>
          <v-col cols="12" sm="3"><v-checkbox v-model="shipForm.options.receipt" label="Com comprovante" /></v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model.number="shipForm.options.insurance_value"
              type="number"
              min="0"
              label="Valor do Seguro"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="shipForm.options.invoice.number"
              label="Nº Nota Fiscal"
              hint="Pode deixar em branco — geramos automaticamente no servidor"
              persistent-hint
            />
            <div class="d-flex mt-1">
              <v-btn size="x-small" variant="text" @click="gerarNumeroNF">
                <v-icon start size="14">mdi-receipt</v-icon> Gerar NF agora
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        :loading="dialogShip.loading"
        :disabled="!dialogShip.valid || !shipForm.products.length"
        @click="confirmEmitirFrete"
      >
        Confirmar e Gerar Etiqueta
      </v-btn>
      <v-btn text @click="dialogShip.visible = false">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'
import draggable from 'vuedraggable'

/** ======================
 *   Config / constantes
 *  ====================== */
const API = 'https://backendgeral-147424face7e.herokuapp.com'
const DEFAULT_POLL_MS = 10000
const token = localStorage.getItem('token')

// remetente padrão
const SENDER = Object.freeze({
  name: 'PEDROLCST',
  address: 'R. Sd. Dorival de Brito',
  number: '270',
  complement: 'Apartamento',
  district: 'Cidade São Jorge',
  city: 'Santo André',
  state_abbr: 'SP',
  postal_code: '09111-590',
  email: 'atendimento@sualoja.com.br',
  document: '00000000000',
  phone: '11961674606'
})

/** ======================
 *   Estado reativo
 *  ====================== */
const loading = ref(false)
const errorMsg = ref('')
const hasErrors = ref(false)
const syncBadgeVisible = ref(false)
const busyId = ref(null)

const menuAutoRefresh = ref(false)
const autoPollEnabled = ref(true)
const pollMsUi = ref(DEFAULT_POLL_MS)

const quickFilter = ref('all') // all/today/gt500/late

const columns = [
  { key: 'pendente', label: 'Pendente', icon: '⏳' },
  { key: 'pago', label: 'Pago', icon: '💳' },
  { key: 'emSeparacao', label: 'Separação', icon: '📦' },
  { key: 'expedicao', label: 'Expedição', icon: '🚚' },
  { key: 'finalizado', label: 'Finalizado', icon: '✅' },
]

const collapse = ref({ pendente: false, pago: false, emSeparacao: false, expedicao: false, finalizado: false })
const lists = ref({ pendente: [], pago: [], emSeparacao: [], expedicao: [], finalizado: [] })

const buscaTexto = ref('')
const buscaDebounced = ref('')
let buscaTimer = null
watch(buscaTexto, (v) => {
  clearTimeout(buscaTimer)
  buscaTimer = setTimeout(() => { buscaDebounced.value = v || '' }, 300)
})

const snackbar = ref({ visible: false, message: '', color: 'success' })
const dialog = ref({ visible: false, pedido: null })

const dialogShip = ref({ visible: false, pedido: null, loading: false, error: '', valid: false })
const formShipRef = ref(null)

const servicosDisponiveis = [
  { title: 'Correios PAC', value: 1 },
  { title: 'Correios Sedex', value: 2 },
  { title: 'Mini Envios', value: 17 },
]

// ship form (com CPF/telefone no to, CPF default)
const shipForm = ref({
  from: { ...SENDER },
  to: {
    name:'', address:'', number:'', complement:'',
    district:'', city:'', state_abbr:'', postal_code:'',
    email:'', document:'', phone:''
  },
  volumes: [{ height: 2, width: 11, length: 16, weight: 0.3 }],
  products: [],
  options: { own_hand: false, receipt: false, insurance_value: 0, invoice: { number: '0' }, non_commercial: true },
  service: 2
})

/** ======================
 *   Utils
 *  ====================== */
const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_')
const isPago = (s) => normalize(s) === 'pago'
const isEmSeparacao = (s) => normalize(s) === 'em_separacao'
const isExpedicao = (s) => normalize(s) === 'expedicao'

const digits = (s) => String(s || '').replace(/\D/g,'')
const num = (v, def=0) => {
  if (v && typeof v === 'object' && ('$numberInt' in v || '$numberDouble' in v)) {
    const raw = v.$numberInt ?? v.$numberDouble; const n = Number(raw); return Number.isFinite(n) ? n : def
  }
  const n = Number(v); return Number.isFinite(n) ? n : def
}
const mapServiceToNumber = (sv) => {
  const n = Number(sv);
  if (Number.isFinite(n) && n > 0) return n;
  const s = String(sv || '').toUpperCase();
  const MAP = { 'SEDEX': 2, 'PAC': 1, 'Mini Envios': 17 };
  return MAP[s] || 2;
}

const ageMs = (d) => {
  try { return Date.now() - new Date(d).getTime() } catch { return 0 }
}
const agePercent = (d) => {
  // 0% = 0h, 100% = 72h (apenas indicador visual)
  const max = 72 * 3600 * 1000
  const v = Math.min(100, Math.max(0, (ageMs(d) / max) * 100))
  return Number(v.toFixed(2))
}
const ageColor = (d) => {
  const h = ageMs(d) / 3600000
  if (h < 12) return 'green'
  if (h < 24) return 'light-green'
  if (h < 48) return 'orange'
  return 'red'
}
const formatDate = (d) => { try { return new Date(d).toLocaleString('pt-BR') } catch { return '' } }
const formatCurrency = (v) => (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const prettyStatus = (status) => {
  const s = normalize(status)
  const map = {
    'pendente': 'Pendente',
    'pago': 'Pago',
    'em_separacao': 'Separação',
    'expedicao': 'Expedição',
    'finalizado': 'Finalizado',
    'cancelado': 'Cancelado',
  }
  return map[s] || status
}

const chipColor = (status) => {
  switch (normalize(status)) {
    case 'pago': return 'green'
    case 'pendente': return 'orange'
    case 'em_separacao': return 'blue'
    case 'expedicao': return 'indigo'
    case 'finalizado': return 'teal'
    default: return 'grey'
  }
}

const statusToKey = (status) => {
  switch (normalize(status)) {
    case 'pendente': return 'pendente'
    case 'pago': return 'pago'
    case 'em_separacao': return 'emSeparacao'
    case 'expedicao': return 'expedicao'
    case 'finalizado': return 'finalizado'
    default: return 'pendente'
  }
}
const keyToStatus = (key) => {
  switch (key) {
    case 'pendente': return 'pendente'
    case 'pago': return 'pago'
    case 'emSeparacao': return 'em_separacao'
    case 'expedicao': return 'expedicao'
    case 'finalizado': return 'finalizado'
    default: return 'pendente'
  }
}

/** ======================
 *   Dados / filtros
 *  ====================== */
const allPedidos = ref([])

const filteredPedidos = computed(() => {
  const q = (buscaDebounced.value || '').toLowerCase().trim()
  const base = allPedidos.value.filter(p => {
    // quick filters
    let pass = true
    if (quickFilter.value === 'today') {
      const d = new Date(p.createdAt); const now = new Date()
      pass = d.toDateString() === now.toDateString()
    } else if (quickFilter.value === 'gt500') {
      pass = Number(p?.valorTotal || 0) > 500
    } else if (quickFilter.value === 'late') {
      pass = (ageMs(p.createdAt) > (48 * 3600 * 1000))
    }
    if (!pass) return false

    if (!q) return true
    return (
      p._id?.toLowerCase().includes(q) ||
      p.usuario?.nome?.toLowerCase().includes(q) ||
      (p.itens || []).some(i =>
        i?.produto?.marcaProduto?.toLowerCase().includes(q) ||
        i?.produto?.descricaoProduto?.toLowerCase().includes(q)
      )
    )
  })
  return base
})



/** ======================
 *   Lógica de coluna
 *  ====================== */
const splitIntoColumns = () => {
  const cols = { pendente: [], pago: [], emSeparacao: [], expedicao: [], finalizado: [] }
  for (const p of filteredPedidos.value) cols[statusToKey(p.status)].push(p)
  for (const k of Object.keys(cols)) cols[k].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  lists.value = cols
}

function sortLane(key, by = 'date') {
  const arr = lists.value[key] || []
  if (by === 'value') {
    arr.sort((a, b) => (b?.valorTotal || 0) - (a?.valorTotal || 0))
  } else {
    arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  lists.value[key] = [...arr]
}


/** ======================
 *   API
 *  ====================== */
async function fetchPedidos() {
  try {
    loading.value = true
    errorMsg.value = ''
    const { data } = await axios.get(`${API}/pedidos`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    allPedidos.value = Array.isArray(data) ? data : []
    splitIntoColumns()
    hasErrors.value = false
  } catch (e) {
    console.error('Erro ao buscar pedidos:', e)
    errorMsg.value = e?.response?.data?.mensagem || 'Erro ao buscar pedidos.'
    hasErrors.value = true
  } finally {
    loading.value = false
    syncBadgeVisible.value = true
    setTimeout(() => (syncBadgeVisible.value = false), 2500)
  }
}

async function atualizarStatus(pedido, novoStatus) {
  const atual = normalize(pedido.status)
  const novo = normalize(novoStatus)
  if (atual === novo) return
  try {
    busyId.value = pedido._id
    await axios.patch(
      `${API}/pedidos/${pedido._id}/status`,
      { status: novo },
      { headers: { Authorization: 'Bearer ' + token } }
    )
    pedido.status = novo
    snackbar.value = { visible: true, message: `Pedido ${pedido._id} → ${prettyStatus(novo)}`, color: 'info' }
    splitIntoColumns()
  } catch (e) {
    console.error('Erro ao atualizar status:', e)
    snackbar.value = { visible: true, message: e?.response?.data?.mensagem || 'Erro ao atualizar status.', color: 'red' }
  } finally {
    busyId.value = null
  }
}

function abrirDetalhes(p) {
  dialog.value = { visible: true, pedido: p }
}
const acaoStatusDialog = async (novo) => {
  if (!dialog.value.pedido) return
  await atualizarStatus(dialog.value.pedido, novo)
  dialog.value = { ...dialog.value, pedido: { ...dialog.value.pedido, status: novo } }
}

function previewImages(pedido) {
  const imgs = []
  for (const it of pedido?.itens || []) {
    for (const src of it?.produto?.imagensProdutos || []) {
      imgs.push(src)
      if (imgs.length >= 3) return imgs
    }
  }
  return imgs
}

/** ======================
 *   Emitir Frete
 *  ====================== */
function buildShipFormFromPedido(p) {
  const from = { ...SENDER }

  const e = p?.enderecoEntrega || {}
  const to = {
    name: p?.usuario?.nome || p?.nomeDestinatario || 'Cliente',
    address: e.rua || '',
    number: String(e.numero || '').trim(),
    complement: e.complemento || '',
    district: e.bairro || '',
    city: e.cidade || '',
    state_abbr: e.estado || '',
    postal_code: digits(e.cep || ''),
    email: p?.usuario?.email || '',
    document: e.document,
    phone: digits(p?.usuario?.telefone || '')
  }

  const vols = []
  let fallbackAlt = 2, fallbackLar = 11, fallbackCmp = 16
  for (const it of (p?.itens || [])) {
    const pr = it?.produto || {}
    const qtd = num(it?.quantidade, 1)
    const base = {
      height: num(pr?.altura, fallbackAlt),
      width: num(pr?.largura, fallbackLar),
      length: num(pr?.comprimento, fallbackCmp),
      weight: Math.max(0.01, num(pr?.peso, 300) / 1000)
    }
    fallbackAlt = base.height || fallbackAlt
    fallbackLar = base.width || fallbackLar
    fallbackCmp = base.length || fallbackCmp
    for (let i=0; i<qtd; i++) vols.push({ ...base })
  }
  const volumes = vols.length ? vols : [{ height: 2, width: 11, length: 16, weight: 0.3 }]

  const products = (p?.itens || []).map(it => {
    const pr = it?.produto || {}
    const nome = `${pr?.marcaProduto || ''} ${pr?.descricaoProduto || 'Produto'}`.trim()
    const varCor = it?.cor ? ` - Cor: ${it.cor}` : ''
    const varTam = it?.tamanho ? ` - Tam: ${it.tamanho}` : ''
    return {
      name: `${nome}${varCor}${varTam}`,
      quantity: num(it?.quantidade, 1),
      unitary_value: num(it?.valorUnitario, pr?.valorProduto)
    }
  })

  const service = mapServiceToNumber(p?.frete?.service || 2)
  const options = {
    own_hand: false,
    receipt: false,
    insurance_value: num(p?.valorTotal, 0),
    invoice: { number: String(p?.pagamentoId || '0') },
    non_commercial: true
  }

  return { from, to, volumes, products, options, service }
}

function openShipDialog(pedido) {
  if (!isExpedicao(pedido.status)) {
    snackbar.value = { visible: true, message: 'Pedido precisa estar em Expedição.', color: 'red' }
    return
  }
  const built = buildShipFormFromPedido(pedido)
  shipForm.value = { ...built }
  dialogShip.value = { visible: true, pedido, loading: false, error: '', valid: true }
}

// gera um número local de NF (opcional; se você não clicar, o backend cria)
function gerarNumeroNF() {
  const ale = `${String(Date.now()).slice(-6)}-${Math.floor(Math.random()*900+100)}`
  if (!shipForm.value.options) shipForm.value.options = { invoice: { number: '' } }
  if (!shipForm.value.options.invoice) shipForm.value.options.invoice = { number: '' }
  shipForm.value.options.invoice.number = ale
}

// já existia; mantemos
function duplicarPrimeiroVolume() {
  if (!shipForm.value.volumes?.length) return
  shipForm.value.volumes.push({ ...shipForm.value.volumes[0] })
}

async function confirmEmitirFrete() {
  const pedido = dialogShip.value.pedido
  if (!pedido) return

  try {
    dialogShip.value.loading = true
    dialogShip.value.error = ''

    // 1) garantir/obter freteId a partir do pedido
    const g = await axios.post(
      `${API}/frete/garantir/${pedido._id}`,
      {},
      { headers: { Authorization: 'Bearer ' + token } }
    )
    const freteId = g?.data?.freteId
    if (!freteId) throw new Error('Não foi possível garantir o frete para este pedido.')

    // 2) montar payload no formato do /frete/etiqueta (igual ao formulário)
    const toDigits = (s) => String(s || '').replace(/\D/g,'')
    const toNum = (v, d=0) => { const n = Number(v); return Number.isFinite(n) ? n : d }
    const minPos = (v, m) => Math.max(m, toNum(v, m))

    const from = {
      ...shipForm.value.from,
      postal_code: toDigits(shipForm.value.from.postal_code || shipForm.value.from.cep)
    }
    const to = {
      ...shipForm.value.to,
      postal_code: toDigits(shipForm.value.to.postal_code || shipForm.value.to.cep),
      document: shipForm.value.to.document
    }

    const first = (Array.isArray(shipForm.value.volumes) ? shipForm.value.volumes[0] : shipForm.value.volumes) || {}
    const volumes = {
      height: minPos(first.height, 1),
      width:  minPos(first.width, 1),
      length: minPos(first.length, 1),
      weight: Math.max(0.01, toNum(first.weight, 0.3))
    }

    const products = (shipForm.value.products || []).map(p => ({
      name: String(p.name || '').trim(),
      quantity: toNum(p.quantity, 1),
      unitary_value: toNum(p.unitary_value, 0)
    }))

    const options = {
      own_hand: !!shipForm.value.options.own_hand,
      receipt: !!shipForm.value.options.receipt,
      insurance_value: toNum(shipForm.value.options.insurance_value, 0),
      use_insurance_value: !!shipForm.value.options.use_insurance_value,
      non_commercial: shipForm.value.options.non_commercial !== false,
      invoice: { number: String(shipForm.value.options?.invoice?.number || '') } // se vazio, backend preenche
    }

    const service  = Number(shipForm.value.service) || 2
    const platform = 'Documentação'

    const payload = { from, to, volumes, products, options, service, platform }
    console.log('[frete] Payload etiqueta:', payload)

    // 3) emitir etiqueta
    const { data } = await axios.post(
      `${API}/frete/etiqueta/${freteId}`,
      payload,
      { headers: { Authorization: 'Bearer ' + token } }
    )

    const etiquetaUrl = data?.url || data?.etiquetaUrl
    if (etiquetaUrl) window.open(etiquetaUrl, '_blank')

    // atualiza pedaço do pedido em memória (tracking/link)
    pedido.frete = {
      ...(pedido.frete || {}),
      etiquetaUrl: etiquetaUrl || null,
      trackingUrl: data?.trackingUrl || null,
      trackingCode: data?.trackingCode || null,
      service
    }

    snackbar.value = { visible: true, message: `Etiqueta gerada para ${pedido._id}`, color: 'success' }
    dialogShip.value.visible = false
  } catch (e) {
  const det = e?.response?.data;
  console.error('Emitir frete erro (raw):', e?.response || e);
  if (det) console.log('[SuperFrete detalhe]', JSON.stringify(det, null, 2));

  const msg =
    det?.detalhe?.message ||
    det?.detalhe?.error ||
    det?.error ||
    det?.mensagem ||
    e?.message ||
    'Erro ao gerar etiqueta.';

  dialogShip.value.error = msg;
  snackbar.value = { visible: true, message: msg, color: 'red' };
}
finally {
    dialogShip.value.loading = false
  }
}



/** ======================
 *   Ações diversas
 *  ====================== */
function rastrearPedido(p) {
  const t = p?.frete?.trackingUrl || p?.frete?.etiquetaUrl
  if (t) return window.open(t, '_blank')
  snackbar.value = { visible: true, message: 'Este pedido ainda não possui link de rastreio.', color: 'red' }
}

function exportCsv() {
  const rows = filteredPedidos.value.map(p => ({
    id: p._id,
    cliente: p?.usuario?.nome || '',
    email: p?.usuario?.email || '',
    telefone: p?.usuario?.telefone || '',
    status: normalize(p.status),
    criado_em: new Date(p.createdAt).toISOString(),
    total: Number(p?.valorTotal || 0)
  }))
  const header = 'id,cliente,email,telefone,status,criado_em,total'
  const csv = [header, ...rows.map(r =>
    [r.id, r.cliente, r.email, r.telefone, r.status, r.criado_em, r.total].map(v =>
      `"${String(v).replace(/"/g, '""')}"`
    ).join(',')
  )].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pedidos_${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/** ======================
 *   Drag & Drop
 *  ====================== */
const onDropEnd = (targetKey) => async (evt) => {
  const moved = evt?.item?.dataset?.id
  if (!moved) return
  const pedido = lists.value[targetKey].find(p => p._id === moved)
  if (!pedido) return
  await atualizarStatus(pedido, keyToStatus(targetKey))
}

/** ======================
 *   Ciclo de vida
 *  ====================== */
let pollHandle = null
watch([filteredPedidos, buscaDebounced, quickFilter], () => splitIntoColumns(), { deep: true })

onMounted(async () => {
  await fetchPedidos()
  startAutoPoll()
})
onUnmounted(() => { stopAutoPoll() })

watch([autoPollEnabled, pollMsUi], () => {
  stopAutoPoll()
  startAutoPoll()
})

function startAutoPoll() {
  if (!autoPollEnabled.value) return
  pollHandle = setInterval(fetchPedidos, Math.max(4000, pollMsUi.value || DEFAULT_POLL_MS))
}
function stopAutoPoll() {
  if (pollHandle) clearInterval(pollHandle)
  pollHandle = null
}

/** ======================
 *   Helpers visuais
 *  ====================== */
function cardClasses(p) {
  const aged = ageMs(p.createdAt)
  return {
    'is-late': aged > 48*3600*1000,
    'is-medium': aged > 24*3600*1000 && aged <= 48*3600*1000,
  }
}
</script>

<style scoped>
/* ======= Layout / cores ======= */
.kanban-root {
  --lane-header: linear-gradient(90deg, #f6f7fb, #eef1f7);
  --lane-border: #E0E0E0;
  --card-border: #DADADA;
  --thumb-border: #E0E0E0;
}

.topbar :deep(.v-btn--variant-elevated) {
  box-shadow: 0 1px 0 rgba(0,0,0,.08) !important;
}

.kanban-row {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scroll-behavior: smooth;
  padding-bottom: 4px;
}
.kanban-col {
  flex: 0 0 360px;
  max-width: 360px;
  min-width: 360px;
}

.kanban-column {
  border: 1px solid var(--lane-border);
  background: #FAFAFA;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 185px);
  transition: box-shadow .2s ease;
}
.kanban-column:hover {
  box-shadow: 0 3px 14px rgba(0,0,0,.05);
}

.kanban-column__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-bottom: 1px solid var(--lane-border);
  background: var(--lane-header);
}

.kanban-dropzone-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.kanban-dropzone {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

/* ======= Card ======= */
.kanban-card {
  border: 1px solid var(--card-border);
  border-radius: 8px;
  box-shadow: none !important;
  padding: 10px;
  margin-bottom: 8px;
  background: white;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
}
.kanban-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0,0,0,.06) !important;
  border-color: #CFCFCF;
}
.kanban-card.is-late {
  border-color: #ffb3b3;
  background: #fff8f8;
}
.kanban-card.is-medium {
  border-color: #ffe6a3;
  background: #fffdf5;
}

.thumb {
  border: 1px solid var(--thumb-border);
  border-radius: 4px;
}

.kanban-card__footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #EEE;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ======= Arraste ======= */
.drag-ghost {
  opacity: 0.6 !important;
}
.drag-active {
  border: 1px dashed #90caf9 !important;
}
.drag-chosen {
  transform: rotate(0.5deg);
}

/* ======= Search ======= */
.kanban-search :deep(.v-field) {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #E0E0E0;
  background: #fff;
}

/* ======= Transições ======= */
.fade-enter-active, .fade-leave-active {
  transition: opacity .18s ease;
}
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ======= Util ======= */
.border { border: 1px solid #E0E0E0; border-radius: 6px; }
.truncate-1 { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
