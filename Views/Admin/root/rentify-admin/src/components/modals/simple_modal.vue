<template >
    <div class="modal-backdrop">
      <div class="modal">
        <header>
          <span class="modal__title">{{title}}</span>
          <hr>
        </header>
        <section class="modal-body">
          <slot name="body"></slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </template>

  <script>
    export default {
      name: 'SimpleModal',
      props: {
        title: {
          type: String,
          required: false
        }
      },
      methods: {}
    };
  </script>

  <style lang="scss">
  .body{
    background-color: rgba(0, 0, 0, 0.3);
  }
    .modal-backdrop {
      position: fixed;
      z-index: 999;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal {
      height: 75%;
      overflow-y: scroll;
      color:black;
      position: relative;
      padding: 10px 25px 10px 25px;
      width: 80%;
      z-index: 1000;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      &__title {
        font-weight: 600;
        font-size: 24px;
        color: var(--black-title);
      }
      &-footer {
        margin-top: 0px;
        display: flex;
        align-items: center;
      }
    }
    .btn-close {
      position: absolute;
      top: 17px;
      right: 17px;
      border: none;
      cursor: pointer;
      font-weight: bold;
      color: #2196F3;
      background: transparent;
    }
  </style>
