<template>
  <div class="toggle-wrapper">
    <label class="toggle">
      <input
        type="checkbox"
        :checked="(mode === 'dark') ? 'checked' : false"
        @change="$emit('toggle')"
      />
      <span class="toggler round"></span>
    </label>
  </div>
</template>

<script>
export default {
  props: ["mode"],

  methods: {
    toggle() {
      console.log("test");
    }
  }
};
</script>

<style>
.toggle {
  position: absolute;
  bottom: 30%;
  right: 25px;
  display: inline-block;
  width: 45px;
  height: 23px;
}

.toggle input {
  opacity: 0;
  widows: 0;
  height: 0;
}

.toggler {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1e1e1e;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.toggler::before {
  position: absolute;
  content: "";
  height: 17px;
  width: 17px;
  left: 4px;
  bottom: 3px;
  background: #fff;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .toggler {
  background: #3f51b5;
}
input:focus + .toggler {
  box-shadow: 0 0 2px #1e1e1e;
}

input:checked + .toggler::before {
  -webkit-transform: translateX(21px);
  -ms-transform: translateX(21px);
  transform: translateX(21px);
}

.toggler.round {
  border-radius: 34px;
}

.toggler.round::before {
  border-radius: 50%;
}
</style>